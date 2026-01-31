import { database } from '@db/connection.db';
import { proveedores } from '@db/tables/proveedor.model';

export async function seedProveedores() {
  console.log('🌱 Seeding proveedores...');

  const proveedoresData = await database
    .insert(proveedores)
    .values([
      {
        tipoDocumento: 'RUC',
        ruc: '20987654321',
        razonSocial: 'Repuestos Auto Parts SAC',
        nombreCompleto: 'Repuestos Auto Parts SAC',
        email: 'ventas@autoparts.pe',
        telefono: '014778899',
        direccion: 'Av. Colonial 1234, Lima',
        imagenes: ['https://iili.io/fubznoB.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20445566778',
        razonSocial: 'Lubricantes del Perú SA',
        nombreCompleto: 'Lubricantes del Perú SA',
        email: 'contacto@lubriperu.com',
        telefono: '015667788',
        direccion: 'Jr. Industrial 567, Callao',
        imagenes: ['https://iili.io/fubzuSa.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20334455667',
        razonSocial: 'Neumáticos Continental EIRL',
        nombreCompleto: 'Neumáticos Continental EIRL',
        email: 'ventas@neumaticoscontinental.pe',
        telefono: '013344556',
        direccion: 'Av. Argentina 890, Lima',
        imagenes: ['https://iili.io/fubzRHJ.jpg'],
      },
      {
        tipoDocumento: 'DNI',
        dni: '75849632',
        nombres: 'Roberto',
        apellidos: 'Silva Mendoza',
        nombreCompleto: 'Roberto Silva Mendoza',
        email: 'roberto.silva@gmail.com',
        telefono: '987654321',
        direccion: 'Calle Los Pinos 456, San Isidro',
        imagenes: ['https://iili.io/fubz5Av.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20556677889',
        razonSocial: 'Servicios Mecánicos Express SAC',
        nombreCompleto: 'Servicios Mecánicos Express SAC',
        email: 'info@mecanicosexpress.pe',
        telefono: '014223344',
        direccion: 'Av. Universitaria 2345, Los Olivos',
        imagenes: ['https://iili.io/fubznoB.jpg'],
      },
      {
        tipoDocumento: 'RUC',
        ruc: '20778899001',
        razonSocial: 'Frenos y Suspensiones SA',
        nombreCompleto: 'Frenos y Suspensiones SA',
        email: 'ventas@frenosysuspensiones.com',
        telefono: '016778899',
        direccion: 'Jr. Manco Cápac 678, Rímac',
        imagenes: ['https://iili.io/fubzuSa.jpg'],
      },
    ])
    .returning();

  console.log(`✅ ${proveedoresData.length} proveedores inserted`);

  return proveedoresData;
}
