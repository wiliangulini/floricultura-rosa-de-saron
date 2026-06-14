const fallbackSiteUrl = "http://localhost:3000";

function removeTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export function getSiteUrl(): URL {
  const siteUrl = removeTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl);

  return new URL(siteUrl);
}

export function createSiteUrl(pathname = "/"): string {
  return new URL(pathname, getSiteUrl()).toString();
}
