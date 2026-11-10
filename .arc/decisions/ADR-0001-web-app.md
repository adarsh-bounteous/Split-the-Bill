---
id: ADR-0001
category: component
title: Web App
status: accepted
superseded_by: null
component_id: comp_web_app
responsibility: Static single-page web app (Vite + TypeScript, or plain HTML + TypeScript)
  running entirely in the browser. Lets users add people to a group, record expenses
  with who paid and who shares, and shows each person's balance and the fewest payments
  that settle everyone. The balance and settlement logic is a pure-function module
  inside this component, kept free of UI code so it is easy to unit test.
kind: web_ui
split_reason: 'Only deployable piece: a static page is the whole system; the settlement
  maths is a module, not a service, as nothing requires a split.'
evidence: 'Human: "No backend, API, database, cloud, email or login: a static web
  page."'
---

## Context

Human: "No backend, API, database, cloud, email or login: a static web page."

## Decision

Static single-page web app (Vite + TypeScript, or plain HTML + TypeScript) running entirely in the browser. Lets users add people to a group, record expenses with who paid and who shares, and shows each person's balance and the fewest payments that settle everyone. The balance and settlement logic is a pure-function module inside this component, kept free of UI code so it is easy to unit test.

Kept separate because Only deployable piece: a static page is the whole system; the settlement maths is a module, not a service, as nothing requires a split..
