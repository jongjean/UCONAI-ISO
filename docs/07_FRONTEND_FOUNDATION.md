# 7. Frontend Foundation

Date: 2026-05-03
Status: Workspace shell in progress

## Objective

The ISO frontend is a professional authoring control room, not a marketing page. It must support roadmap management, structured document editing, AI guidance, references, figures, comments, exports, and runtime gate awareness.

## Primary Layout

| Area | Purpose |
|---|---|
| Sidebar | Project navigation |
| Topbar | Project route and state |
| Roadmap diary | Stage missions and meeting timing |
| Document workspace | Core clauses and OSD cautions |
| AI panel | Directives, OSD and style guidance |
| Runtime panel | runtime-gated risk actions |
| Chapter blocks | Select, expand, add, delete and reorder one chapter at a time |
| Clause outline | Generate 1 / 1.1 / 1.1.1 / 1.1.1.1 numbering automatically |

## Dual Monitor Policy

The editor should support a large left document surface and a right guidance surface. Single-monitor users must receive the same controls in stacked responsive views.

## Completion Criteria

- 1-page, 2-page and 4-page view modes work.
- Each chapter can be handled as a separate block without expanding the full document.
- Chapter blocks can be added, deleted, expanded, collapsed and reordered in the preview workspace.
- Clause blocks can be added, deleted, moved, indented and outdented with automatic numbering.
- The right AI panel can collapse or become secondary.
- Warning states are visible before risky stage changes.
- No production-only action can be triggered from the UI without backend runtime gate checks.

