import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

@Entity()
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  medicationName!: string;

  @Column()
  dosage!: string;

  @ManyToOne(() => Patient, (patient) => patient.prescriptions, {
    onDelete: 'CASCADE',
  })
  patient!: Patient;

  @DeleteDateColumn()
  deletedAt?: Date;
}
