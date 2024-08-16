import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';

import { TechnicianDataPayModule } from './modules/technician-data-pay/technician-data-pay.module';

@Module({
  imports: [DatabaseModule, TechnicianDataPayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
