# Researching Azure DevOps REST APIs (Cloud + Server)

Source of truth: clone and browse the MicrosoftDocs REST API specs repo (Swagger 2.0 JSON).
If docs and specs disagree, treat specs as primary for request shapes and versions.
Repo: https://github.com/MicrosoftDocs/vsts-rest-api-specs.git

## Quick start

- Prefer cloning to a temporary location (ex: /tmp). Ask the human partner for a preferred location.
- Default path for this repo: ~/repos/vsts-rest-api-specs

```bash
# preferred: ask partner for target path
git clone https://github.com/MicrosoftDocs/vsts-rest-api-specs.git /tmp/vsts-rest-api-specs
```

## Repo layout (core)

```
vsts-rest-api-specs/
  specification/
    <area>/
      <version>/
        <area>.json
        httpExamples/
```

Notes:
- Each `<area>` is an API area (build, git, wit, work, etc).
- Each `<version>` is an API version folder.
- Most version folders include a single `<area>.json` Swagger file and optional `httpExamples/`.
- `httpExamples/` contains request/response JSON (file names include HTTP method + operation).

## Versions: Services vs Server

- Azure DevOps Services (cloud): numeric folders like `5.0`, `6.1`, `7.2`.
- Azure DevOps Server (on‑prem): folders like `azure-devops-server-7.0`, `azure-devops-server-7.1`.
- Older TFS: folders like `tfs-4.1`.

Rule of thumb:
- Start with the exact server version folder if it exists.
- If missing, drop to the closest lower version for that area.
- Server lags Services; some areas are Services-only.

## How to find the right spec

1. Identify area: use `ls specification` to find the service name.
2. Pick version folder: cloud vs server rules above.
3. Open `<area>.json` and inspect:
   - `info.version` (often includes `-preview` and optional `.n`)
   - `paths` (endpoints)
   - `parameters` (look for `api-Version-*` entries; descriptions include exact `api-version` values)
   - `definitions` (request/response models)
4. Check `httpExamples/` for concrete request/response samples.
5. Use path placeholders: `{organization}` (Services) maps to org; on‑prem maps to collection.

## Helpful local searches

```bash
# find an area by name
rg --files -g 'git.json' specification

# scan endpoints for a keyword
rg -n "_apis" specification/git/7.2/git.json

# see path placeholders
rg -n '\\{organization\\}|\\{project\\}' specification/build/7.2/build.json

# find api-version parameters
rg -n '"api-version"' specification/build/7.2/build.json

# confirm area metadata
rg -n 'x-ms-vss-(area|resource-area-id)' specification/build/7.2/build.json
```

## Azure DevOps Server (on‑prem) specifics

- Specs still list `host: dev.azure.com` in many files; on‑prem uses your server host instead.
- Base path may include a collection segment (ex: `/tfs/{collection}`); use your server's actual base URL.
- Use the on‑prem version folder as the authority for routes and parameters.
- `api-version` is still required; use the exact value from the on‑prem spec.
- Check `httpExamples/` for base paths and collection/project shapes.

## Extra tips

- Many areas share naming: `build`, `git`, `wit`, `work`, `distributedTask`, `serviceEndpoint`, etc.
- Preview APIs show `-preview` in `info.version`; expect breaking changes.
- If you’re unsure which area owns an endpoint, search across specs with `rg -n`.
