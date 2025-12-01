import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SeedService } from './database/seeds/seed.service';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalGuards(new (AuthGuard('api-key'))());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV === 'production') {
    try {
      const seedService = app.get(SeedService);
      await seedService.seed();
    } catch (error) {
      console.error('❌ Erreur lors du seeding:', error);
    }
  }

  await app.listen(3000, '0.0.0.0');
}
void bootstrap();
