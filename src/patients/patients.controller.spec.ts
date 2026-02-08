/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationQueryDto } from './dto/pagination.dto';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;
  const createMock = (dto: CreatePatientDto) =>
    Promise.resolve({ id: 1, ...dto });
  const findAllMock = (query: PaginationQueryDto) =>
    Promise.resolve({ data: [], meta: {} });
  const findOneMock = (id: number) => Promise.resolve({ id, name: 'John' });
  const updateMock = (id: number, dto: UpdatePatientDto) =>
    Promise.resolve({ id, ...dto });
  const removeMock = (id: number) => Promise.resolve({ id });

  const mockPatientsService = {
    create: jest.fn(createMock),
    findAll: jest.fn(findAllMock),
    findOne: jest.fn(findOneMock),
    update: jest.fn(updateMock),
    remove: jest.fn(removeMock),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        {
          provide: PatientsService,
          useValue: mockPatientsService,
        },
      ],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with DTO', async () => {
      const { create } = mockPatientsService;

      const dto: CreatePatientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        dob: '1990-01-01',
        prescriptions: [],
      };

      (create as jest.Mock).mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);

      expect(create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with pagination params', async () => {
      const { findAll } = mockPatientsService;

      const query = { limit: 10, offset: 0 };
      const expectedResponse = {
        data: [],
        meta: { total: 0, limit: 10, offset: 0 },
      };

      (findAll as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with correct id', async () => {
      const id = 1;
      const { findOne } = mockPatientsService;

      (findOne as jest.Mock).mockResolvedValue({ id, name: 'John Doe' });

      const result = await controller.findOne(id);

      expect(findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const id = 1;
      const { update } = mockPatientsService;
      const dto: UpdatePatientDto = { name: 'Jane Doe' };

      (update as jest.Mock).mockResolvedValue({ id, ...dto });

      await controller.update(id, dto);

      expect(update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      const id = 1;
      const { remove } = mockPatientsService;
      (remove as jest.Mock).mockResolvedValue({ deleted: true });

      await controller.remove(id);

      expect(remove).toHaveBeenCalledWith(id);
    });
  });
});
