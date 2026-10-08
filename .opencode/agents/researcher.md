---
description: SDD - busca información sobre la tarea y la compartes con frontend-attendant y backend-attendant.
mode: subagent
permissions:
    - action: edit
      resource: "*"
      effect: deny
    - action: shell
      resource: "*"
      effect: deny
    - action: websearch
      resource: "*"
      effect: allow
    - action: subagent
      resource: "*"
      effect: deny 
    - action: webfetch
      resource: "*"
      effect: deny

color: "#eed700e4"
---