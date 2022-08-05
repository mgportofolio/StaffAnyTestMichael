import { Server } from '@hapi/hapi';
import * as weekController from './weekController';
import { createWeekDto } from '../../../shared/dtos';

export default function (server: Server, basePath: string) {
  server.route({
    method: "GET",
    path: basePath,
    handler: weekController.find,
    options: {
      description: 'Get published week with filter',
      notes: 'Get published week by week range.',
      tags: ['api', 'week'],
    }
  });
  
  server.route({
    method: "POST",
    path: basePath,
    handler: weekController.create,
    options: {
      description: 'Publish Week',
      notes: 'Publish Week',
      tags: ['api', 'week'],
      validate: {
        payload: createWeekDto
      },
    }
  });
}