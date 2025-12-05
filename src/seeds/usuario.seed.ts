import { database } from "@db/connection.db";
import { usuarios } from "@models/tables/usuario.model";
import * as bcrypt from "bcrypt";

export async function seedUsuarios() {
  console.log("🌱 Seeding users...");

  const hashedPassword = await bcrypt.hash("123456", 10);

  const usersData = await database
    .insert(usuarios)
    .values([
      {
        nombre: "Erick Stip",
        apellido: "Flores Santos",
        email: "erick@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Clive",
        apellido: "Ñahui Xesppe",
        email: "clive@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
    ])
    .returning();

  console.log("✅ Users inserted");
  return usersData;
}
