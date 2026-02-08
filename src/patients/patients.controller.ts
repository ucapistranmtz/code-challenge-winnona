import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient witn prescriptions' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all patients using pagination' })
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.patientsService.findAll(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an specific patient' })
  findOne(@Param('id') id: number) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient properties' })
  update(@Param('id') id: number, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a specific patient' })
  remove(@Param('id') id: number) {
    return this.patientsService.remove(+id);
  }
}
