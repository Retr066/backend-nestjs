import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateTechnicianDataBankDto } from './update-technician-data-bank.dto';

export class UpdateTechnicianDataPayDto {
  @IsOptional() // Permite que este campo sea opcional en una actualización
  @ValidateNested()
  @Type(() => UpdateTechnicianDataBankDto)
  dataBank?: UpdateTechnicianDataBankDto;
}
