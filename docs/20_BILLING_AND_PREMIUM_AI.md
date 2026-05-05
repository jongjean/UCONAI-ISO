# 20. Billing and Premium AI

Date: 2026-05-03
Status: Policy baseline

## Objective

The default service can use approved local AI. Premium AI requires usage governance, cost tracking, user entitlement and provider-key custody policy.

## Payment Models

| Model | Strength | Risk |
|---|---|---|
| UCONAI integrated billing | Easier user experience and central quota control | UCONAI carries provider billing responsibility |
| User-owned API key | User controls direct provider spend | Harder support and policy consistency |
| Hybrid | Default local plus optional premium packs | More complex entitlement model |

## Completion Criteria

- Provider keys are never exposed to frontend.
- Usage ledger records model, purpose, project and estimate.
- Premium features can be disabled instantly.

