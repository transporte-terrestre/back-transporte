import { database } from '@db/connection.db';
import { propietarios } from '@db/tables/propietario.model';

export async function seedPropietarios() {
  console.log('🌱 Seeding propietarios...');

  const propietariosData = await database
    .insert(propietarios)
    .values([
      {
        tipoDocumento: 'DNI',
        dni: '10203040',
        nombres: 'Carlos',
        apellidos: 'Gomez Estrada',
        nombreCompleto: 'Carlos Gomez Estrada',
        email: 'carlos.gomez@gmail.com',
        telefono: '999888777',
        direccion: 'Av. Larco 456, Miraflores',
        imagenes: ['https://iili.io/fubznoB.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20556677881',
        razonSocial: 'Transportes Logisticos SAC',
        nombreCompleto: 'Transportes Logisticos SAC',
        email: 'contacto@translogisticos.pe',
        telefono: '014445566',
        direccion: 'Calle Las Industrias 789, Callao',
        imagenes: ['https://iili.io/fubzuSa.jpg'],
      },
      {
        tipoDocumento: 'DNI',
        dni: '40506070',
        nombres: 'Maria',
        apellidos: 'Alva Rios',
        nombreCompleto: 'Maria Alva Rios',
        email: 'maria.alva@hotmail.com',
        telefono: '955444333',
        direccion: 'Jr. Huancayo 234, Lima',
        imagenes: ['https://iili.io/fubzRHJ.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20112233445',
        razonSocial: 'Inversiones del Norte EIRL',
        nombreCompleto: 'Inversiones del Norte EIRL',
        email: 'admin@norteinversiones.com',
        telefono: '911222333',
        direccion: 'Av. Balta 123, Chiclayo',
        imagenes: ['https://iili.io/fubz5Av.jpg'],
      },
      {
        tipoDocumento: 'DNI',
        dni: '50607080',
        nombres: 'Luis',
        apellidos: 'Mendoza Paredes',
        nombreCompleto: 'Luis Mendoza Paredes',
        email: 'luis.mendoza@gmail.com',
        telefono: '944555666',
        direccion: 'Calle Real 890, Huancayo',
        imagenes: ['https://iili.io/fubz7NR.jpg'],
      },
    ])
    .returning();

  console.log('✅ Propietarios inserted');
  return propietariosData;
}
