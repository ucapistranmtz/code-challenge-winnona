import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'node:path';
import { PatientsModule } from './patients/patients.module';
import { Patient } from './patients/entities/patient.entity';
import { Prescription } from './patients/entities/prescription.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), 'data', 'app.sqlite'),
      entities: [Patient, Prescription],
      synchronize: true,
      logging: ['error', 'warn'],
    }),
    PatientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
