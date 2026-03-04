```dataview
table status, priority, system
from "02_tasks"
where status != "done"
sort priority desc
```