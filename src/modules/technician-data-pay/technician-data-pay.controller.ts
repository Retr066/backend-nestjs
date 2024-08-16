import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { TechnicianDataPayService } from './technician-data-pay.service';
import { CreateTechnicianDataPayDto } from './dto/create-technician-data-pay.dto';
import { UpdateTechnicianDataPayDto } from './dto/update-technician-data-pay.dto';
import { TechnicianDataPay } from './entities/technician-data-pay.entity';

@Controller('technician-data-pay')
export class TechnicianDataPayController {
  constructor(
    private readonly technicianDataPayService: TechnicianDataPayService,
  ) {}

  @Post()
  async create(
    @Body() createTechnicianDataPayDto: CreateTechnicianDataPayDto,
  ): Promise<TechnicianDataPay> {
    try {
      return await this.technicianDataPayService.create(
        createTechnicianDataPayDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<TechnicianDataPay[]> {
    try {
      return await this.technicianDataPayService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error al obtener los regustos de los datos de pagos de los técnicos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TechnicianDataPay> {
    try {
      const technicianDataPay = await this.technicianDataPayService.findOne(id);
      if (!technicianDataPay) {
        throw new HttpException(
          'Datos de pago del técnico no encontrados',
          HttpStatus.NOT_FOUND,
        );
      }
      return technicianDataPay;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTechnicianDataPayDto: UpdateTechnicianDataPayDto,
    //@Res() res: Response,
  ): Promise<{ data: TechnicianDataPay; message: string }> {
    try {
      const result = await this.technicianDataPayService.update(
        id,
        updateTechnicianDataPayDto,
      );
      return {
        data: result,
        message: 'Se actualizo correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.technicianDataPayService.remove(id);
      return {
        message: 'Se elimino correctamente',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
