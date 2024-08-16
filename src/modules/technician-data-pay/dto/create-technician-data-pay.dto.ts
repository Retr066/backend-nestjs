import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateTechnicianDataBankDto } from './create-technician-data-bank.dto';
import { Type } from 'class-transformer';
export class CreateTechnicianDataPayDto {
  @ValidateNested()
  @Type(() => CreateTechnicianDataBankDto)
  @IsNotEmpty({ message: 'Los datos del banco no puede estar vació' })
  dataBank: CreateTechnicianDataBankDto;
}
