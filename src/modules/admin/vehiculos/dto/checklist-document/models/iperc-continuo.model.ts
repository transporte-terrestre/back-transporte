import { VehiculoChecklistDocumentItemUpsertDto } from '../upsert-checklist-document.dto';

export const IpercContinuoModel: VehiculoChecklistDocumentItemUpsertDto[] = [
  {
    label: 'Foto IPERC',
    valorEsperado: 'true',
    metadatos: {
      url: '',
    },
    orden: 1,
    tipoInput: 'texto',
  },
];

export const IpercContinuoMap = {
  'Foto IPERC': 'photo',
};
