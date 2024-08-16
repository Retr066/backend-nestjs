import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTechnicianDataPayDto } from './dto/create-technician-data-pay.dto';
import { UpdateTechnicianDataPayDto } from './dto/update-technician-data-pay.dto';
import { TechnicianDataPay } from './entities/technician-data-pay.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TechnicianDataBank } from './entities/technician-data-bank.entity';

@Injectable()
export class TechnicianDataPayService {
  constructor(
    @InjectRepository(TechnicianDataPay)
    private readonly technicianDataPayRepository: Repository<TechnicianDataPay>,
    @InjectRepository(TechnicianDataBank)
    private readonly technicianDataBankRepository: Repository<TechnicianDataBank>,
    private readonly dataSource: DataSource,
  ) {}

  private async validateUniqueAccountNumberAndCCI(
    accountNumber: string,
    CCI: string,
    existingId?: string,
  ) {
    const existingDataBank = await this.technicianDataBankRepository.findOne({
      where: [{ accountNumber }, { CCI }],
    });

    if (existingDataBank && existingDataBank.id !== existingId) {
      if (existingDataBank.accountNumber === accountNumber) {
        throw new ConflictException('El número de cuenta ya está en uso.');
      }
      if (existingDataBank.CCI === CCI) {
        throw new ConflictException('El CCI ya está en uso.');
      }
    }
  }

  async create(
    createTechnicianDataPayDto: CreateTechnicianDataPayDto,
  ): Promise<TechnicianDataPay> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { dataBank, ...technicianDataPayData } = createTechnicianDataPayDto;

      await this.validateUniqueAccountNumberAndCCI(
        dataBank.accountNumber,
        dataBank.CCI,
      );

      let technicianDataBank = await queryRunner.manager.findOne(
        TechnicianDataBank,
        {
          where: { accountNumber: dataBank.accountNumber, CCI: dataBank.CCI },
        },
      );

      if (!technicianDataBank) {
        technicianDataBank = this.technicianDataBankRepository.create(dataBank);
        technicianDataBank = await queryRunner.manager.save(technicianDataBank);
      }

      const technicianDataPay = this.technicianDataPayRepository.create({
        ...technicianDataPayData,
        dataBank: technicianDataBank,
      });

      const result = await queryRunner.manager.save(technicianDataPay);

      if (!technicianDataBank.dataPay) {
        technicianDataBank.dataPay = result;
        await queryRunner.manager.save(technicianDataBank);
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<TechnicianDataPay[]> {
    return this.technicianDataPayRepository.find({ relations: ['dataBank'] });
  }

  async findOne(id: string): Promise<TechnicianDataPay> {
    return this.technicianDataPayRepository.findOne({
      where: { id },
      relations: ['dataBank'],
    });
  }

  async update(
    id: string,
    updateTechnicianDataPayDto: UpdateTechnicianDataPayDto,
  ): Promise<TechnicianDataPay> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const technicianDataPay = await queryRunner.manager.findOne(
        TechnicianDataPay,
        {
          where: { id },
          relations: ['dataBank'],
        },
      );

      if (!technicianDataPay) {
        throw new Error(`No se encontró datos de pago con ID ${id}`);
      }

      const { dataBank, ...technicianDataPayData } = updateTechnicianDataPayDto;

      if (dataBank) {
        await this.validateUniqueAccountNumberAndCCI(
          dataBank.accountNumber,
          dataBank.CCI,
          technicianDataPay.dataBank.id, // Pasar el ID actual para la validación
        );
      }

      Object.assign(technicianDataPay, technicianDataPayData);

      if (dataBank) {
        let technicianDataBank = await queryRunner.manager.findOne(
          TechnicianDataBank,
          {
            where: { id: technicianDataPay.dataBank.id },
          },
        );
        if (!technicianDataBank) {
          throw new Error(
            'No se encontró el banco de datos del técnico asociado',
          );
        }
        Object.assign(technicianDataBank, dataBank);
        technicianDataBank = await queryRunner.manager.save(technicianDataBank);
        technicianDataPay.dataBank = technicianDataBank;
      }
      const result = await queryRunner.manager.save(technicianDataPay);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const technicianDataPay = await queryRunner.manager.findOne(
        TechnicianDataPay,
        { where: { id }, relations: ['dataBank'] },
      );
      if (!technicianDataPay) {
        throw new Error(`No se encontró los datos de pagos con ID ${id}`);
      }

      await queryRunner.manager.remove(TechnicianDataPay, technicianDataPay);
      if (technicianDataPay.dataBank) {
        await queryRunner.manager.remove(
          TechnicianDataBank,
          technicianDataPay.dataBank,
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
