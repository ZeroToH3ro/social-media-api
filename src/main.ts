import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as dotenv from 'dotenv';
dotenv.load();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
