# llm-tldr CLI usage (uv)

Scope: CLI only. Skip MCP. Use uv instead of pip.

## Install (uv)

- Install once: `uv tool install llm-tldr`

## Core workflow

- `tldr tree <path>` for structure
- `tldr structure <path> --lang typescript` for symbols
- `tldr search "<regex>" <path>` for entry points
- `tldr extract <file> --function <name> --lang typescript` for focused details
- `tldr context <entry> --project . --lang typescript` for call graph context

## Indexing + daemon

- `tldr warm .` builds call graph cache
- `tldr daemon status` check daemon
- `tldr daemon notify <file> --project .` after edits (reindex after threshold)

## Semantic search (optional, heavy download)

- `tldr semantic index . --lang all --model all-MiniLM-L6-v2`
- `tldr semantic search "<query>" --path . --lang typescript`

## Example: URL-based server selection in this repo

1) Locate entry points:
   - `tldr search "serverUrl|organizationUrl|extractOrgFromUrl" src`
2) Inspect extraction logic:
   - `tldr extract src/features/users/get-me/feature.ts --function extractOrgFromUrl --lang typescript`
   - `tldr extract src/features/search/search-code/feature.ts --function extractOrgFromUrl --lang typescript`
3) Check org derivation:
   - `tldr extract src/utils/environment.ts --function getOrgNameFromUrl --lang typescript`
4) Summarize how URL patterns drive which host or org is used.
