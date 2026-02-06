import { VehiculoChecklistDocumentItemCreateDto } from '../create-checklist-document.dto';

export const IpercContinuoModel: VehiculoChecklistDocumentItemCreateDto[] = [
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
