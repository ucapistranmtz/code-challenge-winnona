import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 'phene', description: 'Medication name' })
  @IsString()
  medicationName!: string;

  @ApiProperty({
    example: '500mg every 8 hour',
    description: 'Dosage and frequency',
  })
  @IsString()
  dosage!: string;

  @ApiProperty({ example: '08/20/2026', description: 'Prescription date' })
  @IsDateString()
  date!: string;
}

export class CreatePatientDto {
  @ApiProperty({ example: 'Jhon D', description: 'Patient name ' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '08/20/1984', description: 'Patient DOB' })
  @IsDateString()
  dob!: string;

  @ApiProperty({ example: 'jhond@email.com', description: 'Patient email' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: [CreatePrescriptionDto],
    required: false,
    description: 'List of initial prescriptions',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionDto)
  prescriptions?: CreatePrescriptionDto[];
}
