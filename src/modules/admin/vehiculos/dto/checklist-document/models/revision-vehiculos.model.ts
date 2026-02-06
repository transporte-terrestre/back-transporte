import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';

export const RevisionVehiculosModel: VehiculoChecklistDocumentItemCreateDto[] = [
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
