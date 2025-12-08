import { database } from "@db/connection.db";
import { usuarios } from "@model/tables/usuario.model";
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
      {
        nombre: "Sofia",
        apellido: "Martinez Lopez",
        email: "sofia.martinez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Diego",
        apellido: "Ramirez Torres",
        email: "diego.ramirez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Valentina",
        apellido: "Gonzalez Silva",
        email: "valentina.gonzalez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Lucas",
        apellido: "Fernandez Castro",
        email: "lucas.fernandez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Isabella",
        apellido: "Rodriguez Diaz",
        email: "isabella.rodriguez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Mateo",
        apellido: "Vargas Mendoza",
        email: "mateo.vargas@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Camila",
        apellido: "Rojas Huaman",
        email: "camila.rojas@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Santiago",
        apellido: "Torres Diaz",
        email: "santiago.torres@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Emma",
        apellido: "Ramirez Flores",
        email: "emma.ramirez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Benjamin",
        apellido: "Castro Medina",
        email: "benjamin.castro@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Mia",
        apellido: "Sanchez Ramos",
        email: "mia.sanchez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Sebastian",
        apellido: "Morales Cruz",
        email: "sebastian.morales@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Martina",
        apellido: "Vega Silva",
        email: "martina.vega@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Nicolas",
        apellido: "Jimenez Paredes",
        email: "nicolas.jimenez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Lucia",
        apellido: "Nunez Castillo",
        email: "lucia.nunez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Matias",
        apellido: "Herrera Campos",
        email: "matias.herrera@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Victoria",
        apellido: "Ponce Rojas",
        email: "victoria.ponce@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Thiago",
        apellido: "Salazar Mora",
        email: "thiago.salazar@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Renata",
        apellido: "Rios Gutierrez",
        email: "renata.rios@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Gabriel",
        apellido: "Mendez Luna",
        email: "gabriel.mendez@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Catalina",
        apellido: "Ochoa Suarez",
        email: "catalina.ochoa@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Joaquin",
        apellido: "Reyes Paz",
        email: "joaquin.reyes@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Antonella",
        apellido: "Flores Vera",
        email: "antonella.flores@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
      {
        nombre: "Felipe",
        apellido: "Acosta Lozano",
        email: "felipe.acosta@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Valeria",
        apellido: "Miranda Valle",
        email: "valeria.miranda@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Emiliano",
        apellido: "Campos Arias",
        email: "emiliano.campos@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Julieta",
        apellido: "Leon Santos",
        email: "julieta.leon@gmail.com",
        contrasenia: hashedPassword,
        roles: ["empleado"],
      },
      {
        nombre: "Samuel",
        apellido: "Parra Gamboa",
        email: "samuel.parra@gmail.com",
        contrasenia: hashedPassword,
        roles: ["admin"],
      },
    ])
    .returning();

  console.log("✅ Users inserted");
  return usersData;
}
