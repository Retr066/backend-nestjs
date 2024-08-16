import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { TechnicianDataBank } from './technician-data-bank.entity';

@Entity({ name: 'technicians_data_pay' })
export class TechnicianDataPay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => TechnicianDataBank, (dataBank) => dataBank.dataPay)
  @JoinColumn()
  dataBank: TechnicianDataBank;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
