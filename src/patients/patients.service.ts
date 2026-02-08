import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}
  async create(createPatientDto: CreatePatientDto) {
    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    const [items, total] = await this.patientRepository.findAndCount({
      relations: ['prescriptions'],
      skip: offset,
      take: limit,
    });

    return {
      data: items,
      meta: {
        total,
        limit,
        offset,
      },
    };
  }

  async findOne(id: number) {
    const patient = await this.patientRepository.findOne({
      where: {
        id,
      },
      relations: ['prescriptions'],
    });

    if (!patient) {
      throw new NotFoundException(`id: ${id} was not found`);
    }
    return patient;
  }

  async update(id: number, UpdatePatientDto: UpdatePatientDto) {
    const patient = await this.patientRepository.preload({
      id: +id,
      ...UpdatePatientDto,
    });

    if (!patient) {
      throw new NotFoundException(`The patient with id: ${id} was not found`);
    }
    return this.patientRepository.save(patient);
  }

  async remove(id: number) {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['prescriptions'],
    });
    if (!patient) {
      throw new NotFoundException(`The patient with id: ${id} was not found`);
    }
    return await this.patientRepository.softRemove(patient);
  }
}
