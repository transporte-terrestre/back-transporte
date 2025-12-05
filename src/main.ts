import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { setupSwagger } from "@core/swagger.core";
import { setupTransform } from "@core/transform.core";

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  setupTransform(app);
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
