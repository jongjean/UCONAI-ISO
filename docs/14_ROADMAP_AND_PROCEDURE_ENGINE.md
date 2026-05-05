# 14. Roadmap and Procedure Engine

Date: 2026-05-03
Status: Engine policy and preview baseline

## Objective

The roadmap engine calculates the expected standard-development journey across 18, 24 and 36 month tracks. It must display formal stages, consultations, votes, meeting missions and remaining work.

## Roadmap Concepts

| Concept | Purpose |
|---|---|
| Track | 18, 24 or 36 month schedule profile |
| Stage gate | PWI, NP, WD, CD, DIS, FDIS, publication |
| Meeting event | General meeting, committee meeting, presentation window |
| Mission theme | Consensus-building objective for the next meeting |
| Progress score | Overall, stage, document, reference, asset and consensus progress |

## Completion Criteria

- Track changes recalculate future dates.
- Mandatory minimum windows are visible.
- Meeting mission notes are attached to roadmap points.
- Users can see what must be presented before the next stage.

## Procedure Windows

Official ballot, consultation and decision durations are treated as verified configuration data, not casual hardcoded claims.

| Window | Stage | Product Behavior |
|---|---|---|
| NP ballot | NP | Show proposal package, participation and scope confidence mission |
| CD consultation | CD | Show comment collection and disposition preparation mission |
| DIS ballot | DIS | Show publication-grade draft, reference, figure and response posture mission |
| FDIS decision | FDIS | Show final readiness mission and late-change caution |

Each window stores `sourceStatus`, checked source, checked date and minimum days after current rule verification.

## Track Compression Risk

Changing from 36 to 24 or 18 months recalculates date deltas and produces a risk report per stage:

| Risk Input | Reason |
|---|---|
| Date delta | Shows where schedule has been compressed |
| Stage readiness | Prevents accelerated track change while document, reference or consensus work is weak |
| Unverified windows | Prevents automation based on unverified procedure durations |
| Meeting mission | Keeps human cooperation and presentation timing visible |

