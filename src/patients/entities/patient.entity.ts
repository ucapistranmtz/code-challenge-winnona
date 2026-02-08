import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  dob!: Date;

  @Column({ unique: true })
  email!: string;

  @OneToMany(() => Prescription, (prescription) => prescription.patient, {
    cascade: true,
  })
  prescriptions!: Prescription[];

  @DeleteDateColumn()
  deletedAt?: Date;
}
