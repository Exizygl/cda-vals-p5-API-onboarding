import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

import { Utilisateur } from './modules/utilisateur/utilisateur.entity';
import { Role } from './modules/role/role.entity';

config({ path: '.env.test' });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [Utilisateur, Role],
    }),
    TypeOrmModule.forFeature([Utilisateur, Role]),
  ],
})
export class TestAppLiteModule {}
