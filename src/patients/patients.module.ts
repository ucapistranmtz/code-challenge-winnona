import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Prescription } from './entities/prescription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Prescription])],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
