import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.NATS,
    options: {
      servers: [process.env.NATS_URL || 'nats://localhost:4222'],
      queue: 'social_media_queue',
    },
  });

  // Enable CORS
  app.enableCors();

  // Protect Bull Board route with basic auth
  app.use(
    '/admin/queues',
    basicAuth({
      users: {
        [process.env.ADMIN_USER || 'admin']:
          process.env.ADMIN_PASSWORD || 'password',
      },
      challenge: true,
    }),
  );

  // Rest of your main.ts code
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('The Social Media API description')
    .setVersion('1.0')
    .addTag('social-media')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
