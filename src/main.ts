import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { setupSwagger } from '@core/swagger.core';
import { setupTransform } from '@core/transform.core';
import { setupCors } from '@core/cors.core';
import { setupGlobalFilters } from '@core/filters.core';
import { setupGlobalInterceptors } from '@core/interceptors.core';

process.env.TZ = 'America/Lima';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupCors(app);
  setupTransform(app);
  setupSwagger(app);
  setupGlobalFilters(app);
  setupGlobalInterceptors(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
