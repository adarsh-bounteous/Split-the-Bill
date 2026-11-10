---
id: ADR-0005
category: cross_cutting
title: 'Cross-cutting: Correctness of balance and settlement maths'
status: accepted
superseded_by: null
component_id: null
decision: Settlement logic is pure and deterministic, covered by unit tests. Amounts
  are held in integer minor units (paise) to avoid floating-point error, with an explicit
  rule for distributing rounding remainders in uneven splits; balances always sum
  to zero and the payment list has at most n-1 payments.
evidence: 'Human: "The logic is pure maths ... easy to test, and a wrong answer is
  obvious." Rounding rule proposed.'
---

## Context

Human: "The logic is pure maths ... easy to test, and a wrong answer is obvious." Rounding rule proposed.

## Decision

Settlement logic is pure and deterministic, covered by unit tests. Amounts are held in integer minor units (paise) to avoid floating-point error, with an explicit rule for distributing rounding remainders in uneven splits; balances always sum to zero and the payment list has at most n-1 payments.
