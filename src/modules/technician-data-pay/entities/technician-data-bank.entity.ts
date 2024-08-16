import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicianDataPay } from './technician-data-pay.entity';

@Entity({ name: 'technicians_data_bank' })
export class TechnicianDataBank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column({ unique: true })
  CCI: string;

  @OneToOne(() => TechnicianDataPay, (dataPay) => dataPay.dataBank)
  @JoinColumn()
  dataPay: TechnicianDataPay;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
