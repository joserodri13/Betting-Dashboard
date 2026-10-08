---
description: SDD - implementa los cambios de una tarea en el backend, con tests primero.
mode: subagent
permissions:
    - action: webfetch
      resource: "*"
      effect: deny
    - action: subagent
      resource: "*"
      effect: deny 
    - action: subagent
      resource: "data-ingest"
      effect: allow 

color: "#eed700e4"
---