import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTechnicianDataBankDto {
  @IsString({ message: 'El número de cuenta debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El número de cuenta no puede estar vacío.' })
  @IsNumberString(
    {},
    { message: 'El número de cuenta debe contener solo dígitos.' },
  )
  @MinLength(5, {
    message: 'El número de cuenta debe tener al menos 5 dígitos.',
  })
  @MaxLength(20, {
    message: 'El número de cuenta puede tener hasta 20 dígitos.',
  })
  accountNumber: string;

  @IsString({ message: 'El CCI debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El CCI no puede estar vacío.' })
  @IsNumberString({}, { message: 'El CCI debe contener solo dígitos.' })
  @MinLength(10, { message: 'El CCI debe tener al menos 10 dígitos.' })
  @MaxLength(20, { message: 'El CCI puede tener hasta 20 dígitos.' })
  CCI: string;
}
