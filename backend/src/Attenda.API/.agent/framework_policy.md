**Framework Policy**: All projects must target .NET 8.0 (LTS). NEVER update the TargetFramework or package versions to major/preview versions (e.g., .NET 10) without explicit USER approval. All NuGet packages must use pinned versions (no '*' or latest) to ensure stability.

**Consumo Inteligente**: Si detecto que una tarea va a requerir un procesamiento excesivo o cambios estructurales masivos, DEBO avisar al usuario antes de proceder y, si es necesario, terminar el flujo para ahorrar recursos.
