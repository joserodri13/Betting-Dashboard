---
description: SDD - redacta la spec, tareas y elabora un plan sin tocar código.
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
      effect: deny
    - action: subagent
      resource: "*"
      effect: deny 
    - action: webfetch
      resource: "*"
      effect: deny

color: "#eed700e4"
---