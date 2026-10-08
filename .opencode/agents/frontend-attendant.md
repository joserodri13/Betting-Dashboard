---
description: SDD - implementa los cambios de una tarea en el frontend, con tests primero.
mode: subagent
permissions:
    - action: shell
      resource: "*"
      effect: allow
    - action: subagent
      resource: "*"
      effect: deny 
    - action: subagent
      resource: "backend-attendant"
      effect: allow 

color: "#eed700e4"
---