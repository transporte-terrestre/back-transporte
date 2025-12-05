import { database } from "@db/connection.db";
import { clientes } from "@models/tables/cliente.model";

export async function seedClientes() {
  console.log("🌱 Seeding clients...");

  const clientsData = await database
    .insert(clientes)
    .values([
      {
        dni: "70123456",
        nombre: "Ana",
        apellido: "Martinez Lopez",
        email: "ana.martinez@gmail.com",
        telefono: "987654321",
        direccion: "Av. Arequipa 1234, Lima",
      },
      {
        dni: "70234567",
        nombre: "Pedro",
        apellido: "Gonzales Quispe",
        email: "pedro.gonzales@hotmail.com",
        telefono: "912345678",
        direccion: "Jr. Cusco 567, Arequipa",
      },
      {
        dni: "70345678",
        nombre: "Lucia",
        apellido: "Fernandez Castro",
        email: "lucia.fernandez@gmail.com",
        telefono: "945678123",
        direccion: "Calle Lima 890, Trujillo",
      },
      {
        dni: "70456789",
        nombre: "Roberto",
        apellido: "Vargas Mendoza",
        email: "roberto.vargas@outlook.com",
        telefono: "923456789",
        direccion: "Av. Tacna 321, Chiclayo",
      },
      {
        dni: "70567890",
        nombre: "Carmen",
        apellido: "Rojas Huaman",
        email: null,
        telefono: "956789012",
        direccion: "Jr. Puno 456, Puno",
      },
    ])
    .returning();

  console.log("✅ Clients inserted");
  return clientsData;
}
