import { INestApplication } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from '../filters/all-exceptions.filter';
import { TeamsNotifierService } from '../services/teams-notifier.service';

export function setupGlobalFilters(app: INestApplication) {
  const httpAdapterHost = app.get(HttpAdapterHost);
  const teamsNotifierService = app.get(TeamsNotifierService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, teamsNotifierService));
}
