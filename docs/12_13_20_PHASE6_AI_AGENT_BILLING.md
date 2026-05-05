# Phase 6 AI Gateway, Agents, and Billing

This chapter group covers chapters 12, 13, and 20. It defines how ISO AI assistance is selected, constrained, orchestrated, and accounted for before any model endpoint or paid provider is enabled.

## 1. Phase 6 Objective

| Area | Contract | Source Artifact |
| --- | --- | --- |
| AI provider gateway | Local-first provider policy, premium provider envelope, restricted-file boundary | `aiGatewayPolicy.js` |
| Unified compute policy | One model/GPU routing gateway shared by all agents | `buildUnifiedComputePolicy` |
| Agent orchestration | Registered agents, input checklist, output contract, no canonical write | `agentContracts.js` |
| Chief agent council | Chief agent, specialist roster, generated specialists and escalation policy | `buildChiefAgentControlPlan` |
| Agent brain panel | Chief summary, specialist opinions, conflicts, missions, evidence and human decision preview | `buildAgentBrainPanelPreview` |
| Billing and credits | Integrated credits, BYOK comparison, usage estimates, ledger preview | `billingPolicy.js` |
| Preflight gate | Provider choice, restricted-source boundary, budget and canonical-write block before execution | `buildAiPreflightGate` |

## 2. Provider Selection Policy

| Provider | Use |
| --- | --- |
| `ollama` | Default local/workstation AI for routine drafting, style and advisory checks |
| `premium-api` | High-value reasoning or comparison when credits and policy allow |
| `premium-large-context` | Long context review and cross-document reasoning |
| `code-first-generator` | Editable figures, tables, DOCX/PPTX/SVG/Mermaid artifacts |

The model selection contract keeps HP light: HP routes and stores policy, while heavy model execution belongs to the workstation/Ollama endpoint or configured external provider.

All agents share the same model and GPU execution gateway. Agents are roles; model and GPU selection is centralized by task risk, context size, source sensitivity and budget.

## 3. Agent Policy

Agents may produce:

| Output | Allowed |
| --- | --- |
| Draft alternatives | Yes, as proposals |
| Directives/OSD findings | Yes |
| Style warnings | Yes |
| Roadmap missions | Yes |
| Reference analysis | Yes, according to AI-use mode |
| Editable figure plans | Yes |
| Consensus guidance | Yes, advisory only |
| Canonical document write | No |

Every accepted AI proposal must later be bound to version history and audit.

The chief agent coordinates specialist opinions and may create a narrow task-specific specialist when a gap is detected. The generated specialist still reports to the chief agent, has a narrow scope, and cannot write canonical text.

## 4. Billing Policy

Recommended default: UCONAI integrated credits.

| Model | Strength | Risk |
| --- | --- | --- |
| UCONAI integrated credits | Simple UX, central quotas, membership packaging | UCONAI carries provider billing exposure |
| User-owned provider key | Lower billing exposure for UCONAI | Harder onboarding and key custody complexity |
| Local/basic included | Low marginal cost, better privacy for routine tasks | Quality and context limits |

Required controls:

| Control | Reason |
| --- | --- |
| Per-user/project ledger | Cost accountability |
| Provider/model/purpose records | Audit and billing explanation |
| Premium cost estimate | Prevent surprise usage |
| Hard quota stop | Avoid uncontrolled provider cost |
| Restricted-source policy | Prevent accidental external transmission |

## 5. AI Preflight and Budget Gate

Before any model execution, the platform builds a preflight gate:

| Gate | Required Behavior |
| --- | --- |
| Provider routing | Local Ollama first; premium only for high-value reasoning or large context |
| Source policy | Restricted references stay local unless external transmission is explicitly allowed |
| Budget gate | Premium execution estimates credits and applies hard quota stop |
| Canonical text | AI output remains proposal-only until document command flow accepts it |
| Browser boundary | Browser never calls model providers directly |

## 6. Phase 6 Cross-check

| Check | Required Result |
| --- | --- |
| Model selection policy route exists | Pass |
| AI execution envelope route exists | Pass |
| AI preflight gate route exists | Pass |
| Provider routing matrix route exists | Pass |
| Unified compute policy route exists | Pass |
| Agent orchestration preview route exists | Pass |
| Chief agent control plan route exists | Pass |
| Agent brain panel preview route exists | Pass |
| Payment model comparison route exists | Pass |
| Credit ledger preview route exists | Pass |
| Premium execution budget gate route exists | Pass |
| Premium billing requires credits/policy | Pass |
| AI canonical write is blocked | Pass |
| Code-first generator is available for editable artifacts | Pass |

Phase 6 remains source-only until provider endpoints, secrets, usage persistence, and billing controls are separately enabled.
