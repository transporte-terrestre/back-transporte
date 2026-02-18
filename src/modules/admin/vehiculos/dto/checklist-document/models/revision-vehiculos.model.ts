import { VehiculoChecklistDocumentItemUpsertDto } from '../upsert-checklist-document.dto';

export const RevisionVehiculosModel: VehiculoChecklistDocumentItemUpsertDto[] = [
  {
    label: 'Foto Revision',
    valorEsperado: 'true',
    metadatos: {
      url: '',
    },
    orden: 1,
    tipoInput: 'texto',
  },
];

export const RevisionVehiculosMap = {
  'Foto Revision': 'photo',
};
