import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateTechnicianDataBankDto {
  @IsOptional()
  @IsString({ message: 'El número de cuenta debe ser una cadena de texto.' })
  @Length(5, 20, {
    message: 'El número de cuenta debe tener entre 5 y 20 dígitos.',
  })
  @Matches(/^\d+$/, {
    message: 'El número de cuenta debe contener solo dígitos.',
  })
  accountNumber?: string;

  @IsOptional()
  @IsString({ message: 'El CCI debe ser una cadena de texto.' })
  @Length(5, 20, { message: 'El CCI debe tener entre 5 y 20 dígitos.' })
  @Matches(/^\d+$/, { message: 'El CCI debe contener solo dígitos.' })
  CCI?: string;
}
