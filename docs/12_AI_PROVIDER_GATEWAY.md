# 12. AI Provider Gateway

Date: 2026-05-03
Status: Provider policy and contracts started

## Objective

AI access must be brokered by the backend. HP does not run heavy models directly. Default AI is planned through configured Ollama/workstation endpoints; premium API providers can be enabled only after billing and provider review.

## Provider Classes

| Class | Use |
|---|---|
| Local/Ollama | Default drafting, review and advisory tasks |
| Premium API | High-value reasoning, cross-document review, complex language tasks |
| Code-first generator | Editable charts, flowcharts, diagrams and DOCX/PPTX sources |

## Completion Criteria

- Provider calls are logged.
- Restricted reference files are not sent externally without policy review.
- Usage and cost estimates are recorded.
- Failures do not corrupt document state.

