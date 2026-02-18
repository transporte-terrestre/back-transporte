import { ChecklistInputTipo } from '@db/tables/vehiculo-checklist-document-item.table';

// Helper generico para definir ítems de checklist manteniendo tipos literales en 'label'
// y compatibilidad con el DTO (tipoInput, etc)
export const defineItem = <L extends string>(label: L, orden: number, metadatos?: Record<string, any>, tipoInput: ChecklistInputTipo = 'check') => ({
  label,
  tipoInput,
  orden,
  metadatos,
});
