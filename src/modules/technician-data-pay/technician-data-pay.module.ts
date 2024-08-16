import { Module } from '@nestjs/common';
import { TechnicianDataPayService } from './technician-data-pay.service';
import { TechnicianDataPayController } from './technician-data-pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnicianDataPay } from './entities/technician-data-pay.entity';
import { TechnicianDataBank } from './entities/technician-data-bank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TechnicianDataPay, TechnicianDataBank])],
  controllers: [TechnicianDataPayController],
  providers: [TechnicianDataPayService],
  exports: [TechnicianDataPayService],
})
export class TechnicianDataPayModule {}
