---
id: ADR-0004
category: cross_cutting
title: 'Cross-cutting: No backend, accounts or third-party integrations'
status: accepted
superseded_by: null
component_id: null
decision: No API, database, cloud services, email or login. All computation happens
  in the browser and no user data leaves the device, so there is no server-side data
  protection or compliance regime to design for.
evidence: 'Human: "No backend, API, database, cloud, email or login: a static web
  page."'
---

## Context

Human: "No backend, API, database, cloud, email or login: a static web page."

## Decision

No API, database, cloud services, email or login. All computation happens in the browser and no user data leaves the device, so there is no server-side data protection or compliance regime to design for.
