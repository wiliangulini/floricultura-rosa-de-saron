import { spawnSync } from "node:child_process";
import path from "node:path";

import { describe, expect, it } from "vitest";

const deployScript = path.resolve("deploy-to-vps.sh");

function runDeployScript(args: string[]) {
  return spawnSync("bash", [deployScript, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

describe("deploy-to-vps.sh options", () => {
  it("documenta a flag explícita --sync-catalog", () => {
    const result = runDeployScript(["--help"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("--sync-catalog");
  });

  it("rejeita sincronização de catálogo junto com seed", () => {
    const result = runDeployScript(["--seed", "--sync-catalog"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("--seed and --sync-catalog cannot be used together");
  });

  it("rejeita seed durante dry-run antes de acessar a VPS", () => {
    const result = runDeployScript(["--dry-run", "--seed"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("--seed only applies to a real deploy");
  });

  it("rejeita opções desconhecidas", () => {
    const result = runDeployScript(["--unknown"]);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("Unknown option");
  });
});
