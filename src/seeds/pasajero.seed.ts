import { database } from '@db/connection.db';
import { clientes } from '@db/tables/cliente.table';
import { pasajeros } from '@db/tables/pasajero.table';
import { isNull } from 'drizzle-orm';

export async function seedPasajeros() {
  const { faker } = await import('@faker-js/faker');
  console.log('🌱 Iniciando seed de pasajeros...');

  // 1. Obtener todos los clientes activos
  const clientesList = await database.select({ id: clientes.id }).from(clientes).where(isNull(clientes.eliminadoEn));

  if (clientesList.length === 0) {
    console.warn('⚠️ No hay clientes para asignar pasajeros.');
    return;
  }

  console.log(`📋 Encontrados ${clientesList.length} clientes.`);

  let totalPasajeros = 0;

  // 2. Iterar sobre cada cliente
  for (const cliente of clientesList) {
    const pasajerosParaCliente = [];
    const cantidad = 10; // Mínimo 10 pasajeros por cliente

    for (let i = 0; i < cantidad; i++) {
      // Generar datos aleatorios realistas
      const genero = faker.person.sexType();
      const nombre = faker.person.firstName(genero);
      const apellido = faker.person.lastName();
      // Generar DNI único (8 dígitos) para este batch
      // Nota: En un seed simple puede haber colisiones, pero la constraint protegerá la DB.
      // Para minimizar colisiones en faker, usaremos numeric(8)
      const dni = faker.string.numeric(8);

      pasajerosParaCliente.push({
        clienteId: cliente.id,
        dni: dni,
        nombres: nombre,
        apellidos: apellido,
      });
    }

    try {
      if (pasajerosParaCliente.length > 0) {
        await database.insert(pasajeros).values(pasajerosParaCliente);
        totalPasajeros += pasajerosParaCliente.length;
      }
    } catch (error) {
      console.error(`   ❌ Error insertando pasajeros para Cliente ID ${cliente.id}:`, error);
      // Continuamos con el siguiente cliente
    }
  }

  console.log(`\n✨ Seed de pasajeros completado. Se insertaron ${totalPasajeros} pasajeros en total.`);
}
