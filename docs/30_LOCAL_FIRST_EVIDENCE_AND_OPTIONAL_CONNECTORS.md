# UCONAI-ISO Local-First Evidence Completion Policy

Date: 2026-05-05

## 1. Decision

Zotero integration is deferred to a later update. The current completion target is a fully working local-first ISO document development environment.

UCONAI-ISO must operate without Zotero. Zotero can be added later as an optional reference connector after cost, account, storage and sync policies are decided.

## 2. Current Completion Boundary

| Layer | Current requirement |
| --- | --- |
| HP evidence store | Required, authoritative preservation copy |
| Markdown source | Required, drafting source of truth |
| DOCX export | Required, rendered output package |
| AI Commander | Required, grounded on project-local evidence and Markdown context |
| Obsidian | Optional local-compatible workbench using the same Markdown files |
| Zotero | Future optional connector, not required for completion |

## 3. Local-First Flow

```text
Wizard upload
→ HP immutable save
→ SHA-256 checksum
→ evidence ledger append
→ Markdown note or draft update
→ AI index refresh
→ DOCX export when requested
```

Generated documents follow the same preservation rule:

```text
Markdown source update
→ HP new version save
→ DOCX export job
→ export ledger append
→ optional future reference mirror
```

## 4. Zotero Boundary

Zotero is useful for bibliography, citation workflow and external source library management, but it is not a required storage dependency for the local engine.

The local fallback remains:

- HP stores original and generated files.
- HP stores metadata, checksums, ledgers and snapshots.
- UCONAI-ISO creates internal citation keys and evidence IDs.
- AI Commander uses the HP evidence index and Markdown context.
- DOCX export includes source maps and OSD companion output.

## 5. Obsidian Boundary

Obsidian is treated as an optional Markdown workbench, not a remote dependency.

The same Markdown files can be opened in Obsidian later without changing the HP storage model. This keeps the local engine complete while preserving expansion room for vault sync, note generation and graph navigation.

## 6. Future Connector Readiness

Future Zotero or Obsidian connector work must attach to the local-first contract:

- no connector can be the only preservation copy;
- connector sync failures must not block HP preservation;
- connector metadata must map back to HP document IDs and versions;
- AI access must remain project-scoped;
- optional connectors must be disabled by default until configured.

