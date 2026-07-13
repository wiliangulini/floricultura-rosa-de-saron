#!/usr/bin/env bash

set -euo pipefail

DOMAIN="rosa-de-saron.com"
VPS_HOST="root@31.97.160.61"
REMOTE_DIR="/var/www/html/rosa-de-saron.com"
APP_NAME="floricultura-rosa-de-saron"
PORT="3000"
REMOTE_NODE_BIN="/root/.nvm/versions/node/v22.22.3/bin"

CHECK_ONLY=0
DRY_RUN=0
SKIP_CHECKS=0
RUN_SEED=0
SYNC_CATALOG=0
APPLY_FIXES=0

TIMESTAMP="$(date +%Y%m%d%H%M%S)"
STAGING_DIR="/tmp/rosa-de-saron-deploy-${TIMESTAMP}"
BACKUP_DIR="${REMOTE_DIR}.backup-${TIMESTAMP}"
FAILED_DIR="${REMOTE_DIR}.failed-${TIMESTAMP}"

log() {
  printf '[deploy] %s\n' "$*"
}

warn() {
  printf '[deploy][warn] %s\n' "$*" >&2
}

fail() {
  printf '[deploy][error] %s\n' "$*" >&2
  exit 1
}

usage() {
  cat <<'USAGE'
Usage: ./deploy-to-vps.sh [options]

Options:
  --check-only   Audit local and VPS configuration without deploying.
  --dry-run      Run local checks and simulate rsync without promoting/restarting.
  --skip-checks  Skip local lint, typecheck and tests.
  --seed         Run npm run db:seed explicitly after migrations.
  --sync-catalog Back up and synchronize categories, products, images and store location.
  -h, --help     Show this help.
USAGE
}

for arg in "$@"; do
  case "$arg" in
    --check-only)
      CHECK_ONLY=1
      ;;
    --dry-run)
      DRY_RUN=1
      ;;
    --skip-checks)
      SKIP_CHECKS=1
      ;;
    --seed)
      RUN_SEED=1
      ;;
    --sync-catalog)
      SYNC_CATALOG=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      usage >&2
      fail "Unknown option: ${arg}"
      ;;
  esac
done

if [[ "$CHECK_ONLY" == "1" && "$DRY_RUN" == "1" ]]; then
  fail "--check-only and --dry-run cannot be used together."
fi

if [[ "$RUN_SEED" == "1" && ( "$CHECK_ONLY" == "1" || "$DRY_RUN" == "1" ) ]]; then
  fail "--seed only applies to a real deploy."
fi

if [[ "$RUN_SEED" == "1" && "$SYNC_CATALOG" == "1" ]]; then
  fail "--seed and --sync-catalog cannot be used together."
fi

if [[ ! -f "package.json" || ! -f "prisma/schema.prisma" ]]; then
  fail "Run this script from the project root."
fi

remote_env_command() {
  printf 'DOMAIN=%q VPS_HOST=%q REMOTE_DIR=%q APP_NAME=%q PORT=%q REMOTE_NODE_BIN=%q TIMESTAMP=%q STAGING_DIR=%q BACKUP_DIR=%q FAILED_DIR=%q RUN_SEED=%q SYNC_CATALOG=%q APPLY_FIXES=%q bash -se' \
    "$DOMAIN" \
    "$VPS_HOST" \
    "$REMOTE_DIR" \
    "$APP_NAME" \
    "$PORT" \
    "$REMOTE_NODE_BIN" \
    "$TIMESTAMP" \
    "$STAGING_DIR" \
    "$BACKUP_DIR" \
    "$FAILED_DIR" \
    "$RUN_SEED" \
    "$SYNC_CATALOG" \
    "$APPLY_FIXES"
}

remote_sh() {
  ssh "$VPS_HOST" "$(remote_env_command)"
}

require_local_command() {
  local command_name="$1"

  if ! command -v "$command_name" >/dev/null 2>&1; then
    fail "Required local command not found: ${command_name}"
  fi
}

run_local_checks() {
  if [[ "$SKIP_CHECKS" == "1" ]]; then
    warn "Skipping local lint, typecheck and tests because --skip-checks was provided."
    return
  fi

  log "Running local lint..."
  npm run lint

  log "Running local typecheck..."
  npm run typecheck

  log "Running local tests..."
  npm test
}

validate_local_environment() {
  log "Validating local tools..."
  require_local_command ssh
  require_local_command rsync
  require_local_command npm
}

audit_remote() {
  local apply_fixes="$1"

  if [[ "$apply_fixes" == "1" ]]; then
    log "Auditing VPS and applying missing configuration when needed..."
  else
    log "Auditing VPS without changes..."
  fi

  APPLY_FIXES="$apply_fixes" remote_sh <<'REMOTE'
set -euo pipefail

: "${APPLY_FIXES:=0}"

log() {
  printf '[remote] %s\n' "$*"
}

warn() {
  printf '[remote][warn] %s\n' "$*" >&2
}

fail() {
  printf '[remote][error] %s\n' "$*" >&2
  exit 1
}

fix_or_fail() {
  local message="$1"

  if [[ "$APPLY_FIXES" == "1" ]]; then
    log "$message"
  else
    fail "$message"
  fi
}

export PATH="${REMOTE_NODE_BIN}:${PATH}"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

service_is_active() {
  systemctl is-active --quiet "$1"
}

service_is_enabled() {
  systemctl is-enabled --quiet "$1"
}

install_packages_if_possible() {
  if [[ "$APPLY_FIXES" != "1" ]]; then
    return 1
  fi

  if ! command_exists apt-get; then
    fail "apt-get is not available; cannot install missing packages automatically."
  fi

  DEBIAN_FRONTEND=noninteractive apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y "$@"
}

require_node() {
  if [[ ! -x "${REMOTE_NODE_BIN}/node" || ! -x "${REMOTE_NODE_BIN}/npm" ]]; then
    fail "Node runtime not found at ${REMOTE_NODE_BIN}. Install Node >=20.9.0 there or update REMOTE_NODE_BIN."
  fi

  local node_version
  node_version="$("${REMOTE_NODE_BIN}/node" -p 'process.versions.node')"

  "${REMOTE_NODE_BIN}/node" - "$node_version" <<'NODE'
const version = process.argv[2].split(".").map(Number);
const minimum = [20, 9, 0];
for (let i = 0; i < minimum.length; i += 1) {
  if ((version[i] || 0) > minimum[i]) process.exit(0);
  if ((version[i] || 0) < minimum[i]) process.exit(1);
}
process.exit(0);
NODE

  log "Node OK: v${node_version}"
  log "npm OK: $("${REMOTE_NODE_BIN}/npm" -v)"
}

ensure_apache() {
  if ! command_exists apache2ctl; then
    fix_or_fail "Apache is missing; installing apache2."
    install_packages_if_possible apache2
  fi

  if ! service_is_active apache2; then
    fix_or_fail "Apache is not active; enabling and starting apache2."
    systemctl enable --now apache2
  fi

  local module
  local changed=0
  for module in proxy proxy_http headers rewrite ssl; do
    if ! apache2ctl -M 2>/dev/null | grep -q " ${module}_module"; then
      fix_or_fail "Apache module ${module} is missing; enabling it."
      a2enmod "$module"
      changed=1
    fi
  done

  if [[ "$changed" == "1" ]]; then
    apache2ctl configtest
    systemctl reload apache2
  fi

  log "Apache OK"
}

write_http_vhost() {
  cat >"/etc/apache2/sites-available/${DOMAIN}.conf" <<HTTP_VHOST
<VirtualHost *:80>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}

    DocumentRoot ${REMOTE_DIR}/public_html

    <Directory ${REMOTE_DIR}/public_html>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/\\.well-known/acme-challenge/
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

    ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}-error.log
    CustomLog \${APACHE_LOG_DIR}/${DOMAIN}-access.log combined
</VirtualHost>
HTTP_VHOST
}

write_ssl_vhost() {
  cat >"/etc/apache2/sites-available/${DOMAIN}-le-ssl.conf" <<SSL_VHOST
<IfModule mod_ssl.c>
<VirtualHost *:443>
    ServerName ${DOMAIN}
    ServerAlias www.${DOMAIN}

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    ProxyPass / http://127.0.0.1:${PORT}/
    ProxyPassReverse / http://127.0.0.1:${PORT}/

    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set X-Frame-Options "SAMEORIGIN"

    ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}-ssl-error.log
    CustomLog \${APACHE_LOG_DIR}/${DOMAIN}-ssl-access.log combined

    Include /etc/letsencrypt/options-ssl-apache.conf
    SSLCertificateFile /etc/letsencrypt/live/${DOMAIN}/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/${DOMAIN}/privkey.pem
</VirtualHost>
</IfModule>
SSL_VHOST
}

ensure_vhosts() {
  local http_vhost="/etc/apache2/sites-available/${DOMAIN}.conf"
  local ssl_vhost="/etc/apache2/sites-available/${DOMAIN}-le-ssl.conf"
  local changed=0

  if [[ ! -d "${REMOTE_DIR}/public_html" ]]; then
    fix_or_fail "Apache public_html directory is missing; creating ${REMOTE_DIR}/public_html."
    mkdir -p "${REMOTE_DIR}/public_html"
    changed=1
  fi

  if [[ ! -f "$http_vhost" ]]; then
    fix_or_fail "HTTP vhost is missing; creating ${http_vhost}."
    write_http_vhost
    changed=1
  elif ! grep -q "ServerName ${DOMAIN}" "$http_vhost"; then
    fix_or_fail "HTTP vhost does not match ${DOMAIN}; replacing it after backup."
    cp "$http_vhost" "${http_vhost}.backup-${HOSTNAME:-vps}-$(date +%Y%m%d%H%M%S)"
    write_http_vhost
    changed=1
  fi

  if [[ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" || ! -f "/etc/letsencrypt/live/${DOMAIN}/privkey.pem" ]]; then
    fail "LetsEncrypt certificate for ${DOMAIN} is missing. Configure certbot before deploying."
  fi

  if [[ ! -f "$ssl_vhost" ]]; then
    fix_or_fail "SSL vhost is missing; creating ${ssl_vhost}."
    write_ssl_vhost
    changed=1
  elif ! grep -q "ProxyPass / http://127.0.0.1:${PORT}/" "$ssl_vhost"; then
    fix_or_fail "SSL vhost is not proxying to 127.0.0.1:${PORT}; replacing it after backup."
    cp "$ssl_vhost" "${ssl_vhost}.backup-${HOSTNAME:-vps}-$(date +%Y%m%d%H%M%S)"
    write_ssl_vhost
    changed=1
  fi

  if [[ "$APPLY_FIXES" == "1" ]]; then
    a2ensite "${DOMAIN}.conf" >/dev/null
    a2ensite "${DOMAIN}-le-ssl.conf" >/dev/null
  else
    if [[ ! -e "/etc/apache2/sites-enabled/${DOMAIN}.conf" ]]; then
      fail "HTTP vhost exists but is not enabled: ${DOMAIN}.conf"
    fi

    if [[ ! -e "/etc/apache2/sites-enabled/${DOMAIN}-le-ssl.conf" ]]; then
      fail "SSL vhost exists but is not enabled: ${DOMAIN}-le-ssl.conf"
    fi
  fi

  apache2ctl configtest

  if [[ "$changed" == "1" ]]; then
    systemctl reload apache2
  fi

  log "Apache vhosts OK"
}

ensure_postgresql() {
  if ! command_exists psql; then
    fix_or_fail "PostgreSQL client is missing; installing postgresql-client."
    install_packages_if_possible postgresql-client
  fi

  if ! service_is_active postgresql; then
    fix_or_fail "PostgreSQL is not active; enabling and starting postgresql."
    systemctl enable --now postgresql
  fi

  if ! command_exists pg_dump; then
    fail "PostgreSQL backup tool pg_dump is missing."
  fi

  log "PostgreSQL OK: $(psql --version)"
}

ensure_pm2() {
  if ! command_exists pm2; then
    fix_or_fail "PM2 is missing; installing it globally with npm."
    npm install -g pm2
  fi

  pm2 ping >/dev/null

  if ! service_is_enabled pm2-root; then
    fix_or_fail "pm2-root startup service is not enabled; enabling PM2 startup."
    pm2 startup systemd -u root --hp /root >/dev/null
    systemctl enable pm2-root >/dev/null
  fi

  if ! service_is_active pm2-root; then
    fix_or_fail "pm2-root startup service is not active; starting it."
    systemctl start pm2-root
  fi

  log "PM2 OK"
}

read_env_value() {
  local key="$1"
  local env_file="${REMOTE_DIR}/.env"
  local value

  value="$(awk -v key="$key" '
    index($0, key "=") == 1 {
      value = $0
      sub(/^[^=]*=/, "", value)
    }
    END {
      print value
    }
  ' "$env_file")"

  if [[ "$value" == \"*\" && "$value" == *\" ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" == \'*\' && "$value" == *\' ]]; then
    value="${value:1:${#value}-2}"
  fi

  printf '%s' "$value"
}

require_env_key() {
  local key="$1"
  local value

  value="$(read_env_value "$key")"
  if [[ -z "$value" ]]; then
    fail "Required production env var is missing or empty in ${REMOTE_DIR}/.env: ${key}"
  fi
}

validate_remote_env() {
  if [[ ! -f "${REMOTE_DIR}/.env" ]]; then
    fail "Production .env is missing at ${REMOTE_DIR}/.env. Create it on the VPS; local .env is never uploaded."
  fi

  require_env_key DATABASE_URL
  require_env_key NEXT_PUBLIC_SITE_URL
  require_env_key AUTH_SECRET
  require_env_key SMTP_HOST
  require_env_key SMTP_PORT
  require_env_key SMTP_USER
  require_env_key SMTP_PASS
  require_env_key SMTP_FROM
  require_env_key CLOUDINARY_CLOUD_NAME
  require_env_key CLOUDINARY_API_KEY
  require_env_key CLOUDINARY_API_SECRET

  local auth_secret site_url database_url smtp_port
  auth_secret="$(read_env_value AUTH_SECRET)"
  site_url="$(read_env_value NEXT_PUBLIC_SITE_URL)"
  database_url="$(read_env_value DATABASE_URL)"
  smtp_port="$(read_env_value SMTP_PORT)"

  if (( ${#auth_secret} < 32 )); then
    fail "AUTH_SECRET must have at least 32 characters in production .env."
  fi

  if [[ ! "$site_url" =~ ^https:// ]]; then
    fail "NEXT_PUBLIC_SITE_URL must be an https URL in production .env."
  fi

  if [[ "$site_url" =~ localhost|127\.0\.0\.1 ]]; then
    fail "NEXT_PUBLIC_SITE_URL cannot point to localhost in production .env."
  fi

  if [[ ! "$database_url" =~ ^postgres(ql)?:// ]]; then
    fail "DATABASE_URL must be a PostgreSQL URL in production .env."
  fi

  if [[ ! "$smtp_port" =~ ^[0-9]+$ ]]; then
    fail "SMTP_PORT must be numeric in production .env."
  fi

  if [[ "$RUN_SEED" == "1" ]]; then
    local admin_initial_password
    admin_initial_password="$(read_env_value ADMIN_INITIAL_PASSWORD || true)"
    if [[ -z "$admin_initial_password" ]]; then
      warn "ADMIN_INITIAL_PASSWORD is not set. Seed will still run, but it will fail if the admin user does not exist yet."
    fi
  fi

  log "Production .env OK"
}

require_node
ensure_apache
ensure_postgresql
ensure_pm2
ensure_vhosts
validate_remote_env
REMOTE
}

prepare_remote_staging() {
  log "Preparing remote staging directory: ${STAGING_DIR}"
  remote_sh <<'REMOTE'
set -euo pipefail

case "$STAGING_DIR" in
  /tmp/rosa-de-saron-deploy-*) ;;
  *)
    printf '[remote][error] Refusing unsafe staging dir: %s\n' "$STAGING_DIR" >&2
    exit 1
    ;;
esac

rm -rf "$STAGING_DIR"
mkdir -p "$STAGING_DIR"
REMOTE
}

rsync_to_staging() {
  local rsync_mode=()

  if [[ "$DRY_RUN" == "1" ]]; then
    rsync_mode+=(--dry-run)
    log "Simulating rsync to ${VPS_HOST}:${STAGING_DIR}/"
  else
    log "Syncing project to ${VPS_HOST}:${STAGING_DIR}/"
  fi

  rsync -az --delete "${rsync_mode[@]}" \
    --include '.env.example' \
    --exclude '.git/' \
    --exclude '.env' \
    --exclude '.env.*' \
    --exclude '.claude/' \
    --exclude 'node_modules/' \
    --exclude '.next/' \
    --exclude 'out/' \
    --exclude 'build/' \
    --exclude 'dist/' \
    --exclude '*.tsbuildinfo' \
    --exclude '*.log' \
    --exclude '.DS_Store' \
    --exclude '.playwright-mcp/' \
    --exclude 'coverage/' \
    --exclude 'e2e/.auth/' \
    --exclude 'e2e/test-results/' \
    --exclude 'playwright-report/' \
    ./ "${VPS_HOST}:${STAGING_DIR}/"
}

build_and_promote_remote() {
  log "Building, migrating and promoting release on the VPS..."

  remote_sh <<'REMOTE'
set -euo pipefail

export PATH="${REMOTE_NODE_BIN}:${PATH}"

PROMOTION_STARTED=0

log() {
  printf '[remote] %s\n' "$*"
}

warn() {
  printf '[remote][warn] %s\n' "$*" >&2
}

fail() {
  printf '[remote][error] %s\n' "$*" >&2
  exit 1
}

restore_backup() {
  local status="$1"

  if [[ "$PROMOTION_STARTED" == "1" && -d "$BACKUP_DIR" ]]; then
    warn "Deploy failed after promotion. Restoring backup from ${BACKUP_DIR}."

    if [[ -d "$REMOTE_DIR" ]]; then
      mv "$REMOTE_DIR" "$FAILED_DIR"
      warn "Failed release kept at ${FAILED_DIR}."
    fi

    mv "$BACKUP_DIR" "$REMOTE_DIR"

    cd "$REMOTE_DIR"
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a

    if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
      pm2 delete "$APP_NAME" >/dev/null || true
    fi

    pm2 start npm --name "$APP_NAME" -- start -- -p "$PORT" >/dev/null || true
    pm2 save >/dev/null || true
  fi

  exit "$status"
}

trap 'restore_backup $?' ERR

case "$STAGING_DIR" in
  /tmp/rosa-de-saron-deploy-*) ;;
  *)
    fail "Refusing unsafe staging dir: ${STAGING_DIR}"
    ;;
esac

if [[ ! -d "$STAGING_DIR" ]]; then
  fail "Staging directory does not exist: ${STAGING_DIR}"
fi

if [[ ! -f "${REMOTE_DIR}/.env" ]]; then
  fail "Production .env is missing at ${REMOTE_DIR}/.env"
fi

install -m 600 "${REMOTE_DIR}/.env" "${STAGING_DIR}/.env"

cd "$STAGING_DIR"
set -a
# shellcheck disable=SC1091
source .env
set +a

log "Installing dependencies with npm ci..."
npm ci --include=dev

log "Generating Prisma client..."
npx prisma generate

log "Building Next.js app..."
npm run build

if [[ "$SYNC_CATALOG" == "1" ]]; then
  _database_backup_dir="/var/backups/${DOMAIN}"
  _database_backup_path="${_database_backup_dir}/database-${TIMESTAMP}.dump"
  _database_url_for_pg="${DATABASE_URL%%\?*}"

  log "Creating PostgreSQL backup before migrations and catalog synchronization..."
  install -d -m 700 "$_database_backup_dir"
  pg_dump --dbname="$_database_url_for_pg" --format=custom --file="$_database_backup_path"
  chmod 600 "$_database_backup_path"
  log "PostgreSQL backup created: ${_database_backup_path}"
fi

log "Applying Prisma migrations..."
npm run db:migrate:deploy

if [[ "$RUN_SEED" == "1" ]]; then
  log "Running production seed because --seed was provided..."
  npm run db:seed
fi

if [[ "$SYNC_CATALOG" == "1" ]]; then
  log "Running catalog synchronization diagnostics..."
  npm run db:update:categories
  npm run db:import:products
  npm run db:update:store-location
  npm run db:remove:legacy-products

  log "Applying catalog synchronization..."
  npm run db:update:categories:apply
  npm run db:import:products:apply
  npm run db:update:store-location:apply
  npm run db:remove:legacy-products:apply
  npm run db:verify:catalog
fi

log "Promoting staging release to ${REMOTE_DIR}..."
PROMOTION_STARTED=1

if [[ -d "$REMOTE_DIR" ]]; then
  mv "$REMOTE_DIR" "$BACKUP_DIR"
fi

mv "$STAGING_DIR" "$REMOTE_DIR"
mkdir -p "${REMOTE_DIR}/public_html"

cd "$REMOTE_DIR"
set -a
# shellcheck disable=SC1091
source .env
set +a

if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 delete "$APP_NAME" >/dev/null
fi

log "Starting PM2 app ${APP_NAME} on port ${PORT}..."
pm2 start npm --name "$APP_NAME" -- start -- -p "$PORT" >/dev/null
pm2 save >/dev/null

log "Waiting for app to start on port ${PORT}..."
_max_wait=60
_waited=0
until curl -fsS --max-time 5 "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; do
  if (( _waited >= _max_wait )); then
    fail "App did not start within ${_max_wait}s. Check: pm2 logs ${APP_NAME}"
  fi
  sleep 3
  (( _waited += 3 ))
done
log "App is up on port ${PORT}."

log "Checking public HTTPS health..."
curl -fsS --max-time 30 "https://${DOMAIN}/" >/dev/null
curl -fsS --max-time 30 "https://${DOMAIN}/sitemap.xml" >/dev/null
curl -fsS --max-time 30 "https://${DOMAIN}/robots.txt" >/dev/null

log "Deploy completed successfully."
REMOTE
}

main() {
  validate_local_environment
  run_local_checks

  if [[ "$CHECK_ONLY" == "1" ]]; then
    APPLY_FIXES=0 audit_remote 0
    log "Check-only completed."
    return
  fi

  if [[ "$DRY_RUN" == "1" ]]; then
    APPLY_FIXES=0 audit_remote 0
    rsync_to_staging
    if [[ "$SYNC_CATALOG" == "1" ]]; then
      log "Dry run only: catalog synchronization and database backup were not executed."
    fi
    log "Dry run completed. No files were promoted and PM2 was not restarted."
    return
  fi

  APPLY_FIXES=1 audit_remote 1
  prepare_remote_staging
  rsync_to_staging
  build_and_promote_remote

  log "Done: https://${DOMAIN}/"
}

main "$@"
