import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { NotFoundException } from '@nestjs/common';

import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

describe('PatientsService', () => {
  let service: PatientsService;

  const mockPatientRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
    softRemove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockPatientRepository,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new patient', async () => {
      const name = 'Test Patient ' + Date.now();
      const email = `${Date.now()}test@mainModule.com`;
      const patientDto: CreatePatientDto = {
        name,
        email,
        dob: '2010-01-01',
        prescriptions: [
          {
            medicationName: 'ibuprofen',
            dosage: '500mg',
            date: '2026-08-01',
          },
        ],
      };

      mockPatientRepository.create.mockReturnValue(patientDto);
      mockPatientRepository.save.mockResolvedValue({ id: 1, ...patientDto });
      const result = await service.create(patientDto);

      expect(mockPatientRepository.create).toHaveBeenCalledWith(patientDto);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe(name);
    });
  });

  describe('findAll', () => {
    it('should return paginated patients', async () => {
      const patients = [{ id: 1, name: 'John' }];
      mockPatientRepository.findAndCount.mockResolvedValue([patients, 1]);

      const result = await service.findAll({ limit: 10, offset: 0 });

      expect(result.data).toEqual(patients);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a patient if exists', async () => {
      const name = 'Test Patient ' + Date.now();

      const updateDto: UpdatePatientDto = { name };
      const patient = { id: 1, ...updateDto };

      mockPatientRepository.preload.mockResolvedValue(patient);
      mockPatientRepository.save.mockResolvedValue(patient);

      const result = await service.update(1, updateDto);

      expect(result.name).toEqual(name);
      expect(mockPatientRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if patient does not exist', async () => {
      mockPatientRepository.preload.mockResolvedValue(null);

      await expect(
        service.update(0, { name: 'Jorge' } as UpdatePatientDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a patient', async () => {
      const patient = { id: 1, name: 'John' };

      mockPatientRepository.findOne.mockResolvedValue(patient);

      mockPatientRepository.softRemove.mockResolvedValue(patient);

      const result = await service.remove(1);

      expect(mockPatientRepository.softRemove).toHaveBeenCalledWith(patient);
      expect(result).toEqual(patient);
    });

    it('should throw NotFoundException if patient does not exist', async () => {
      mockPatientRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);

      expect(mockPatientRepository.softRemove).not.toHaveBeenCalled();
    });
  });
});
