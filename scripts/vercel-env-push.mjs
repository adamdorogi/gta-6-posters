import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseArgs, parseEnv } from "node:util";

const variableTypes = {
  SUPABASE_URL: "config",
  SUPABASE_SECRET_KEY: "secret",
  STRIPE_SECRET_KEY: "secret",
  META_ACCESS_TOKEN: "secret",
  TIKTOK_ACCESS_TOKEN: "secret",
};

function pushEnvironment() {
  const { values } = parseArgs({
    options: {
      project: { type: "string" },
      scope: { type: "string" },
      environment: { type: "string" },
      file: { type: "string" },
      "dry-run": { type: "boolean" },
    },
  });
  const { project, scope, environment, file } = values;
  if (!project || !scope || !file || !["production", "preview"].includes(environment)) {
    throw new Error(
      "Usage: pnpm vercel:env:push --project NAME --scope TEAM --environment production|preview --file PATH [--dry-run]",
    );
  }

  const env = parseEnv(readFileSync(file, "utf8"));
  const variables = Object.entries(variableTypes);
  const missing = variables
    .map(([name]) => name)
    .filter((name) => !env[name]?.trim() || env[name].trim() === "[SENSITIVE]");
  if (missing.length) {
    throw new Error(`Missing or masked values in ${file} for ${missing.join(", ")}`);
  }

  console.log(`${scope}/${project} (${environment})`);
  if (values["dry-run"]) {
    console.log(`Ready to upload ${variables.map(([name]) => name).join(", ")}`);
    return;
  }

  for (const [name, type] of variables) {
    const result = spawnSync(
      "pnpm",
      [
        "run", "vercel", "env", "add", name,
        "--project", project, "--scope", scope,
        "--environment", environment, "--type", type,
        "--force", "--yes", "--non-interactive",
      ],
      { input: env[name], encoding: "utf8" },
    );
    if (result.status !== 0) {
      let detail = [result.error?.message, result.stderr, result.stdout]
        .filter(Boolean)
        .join("\n")
        .trim();
      for (const [variable] of variables) {
        detail = detail.replaceAll(env[variable], "[redacted]");
      }
      throw new Error(`Vercel failed to save ${name}.\n${detail}`);
    }
    console.log(`Saved ${name}`);
  }
}

try {
  pushEnvironment();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
