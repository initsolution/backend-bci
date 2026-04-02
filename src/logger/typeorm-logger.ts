import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger } from '@nestjs/common';

export class TypeOrmWinstonLogger implements TypeOrmLogger {
  private readonly logger = new Logger('DATABASE');

  // Log query yang berhasil
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters?.length ? ` -- Parameters: ${JSON.stringify(parameters)}` : '');
    this.logger.log(`[QUERY]: ${sql}`);
  }

  // Log query yang error (sangat penting!)
  logQueryError(error: string | Error, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters?.length ? ` -- Parameters: ${JSON.stringify(parameters)}` : '');
    this.logger.error(`[FAILED]: ${sql} -- ERROR: ${error}`);
  }

  // Log query yang lambat (slow query)
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql = query + (parameters?.length ? ` -- Parameters: ${JSON.stringify(parameters)}` : '');
    this.logger.warn(`[SLOW - ${time}ms]: ${sql}`);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`[SCHEMA]: ${message}`);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log(`[MIGRATION]: ${message}`);
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    if (level === 'log' || level === 'info') this.logger.log(message);
    if (level === 'warn') this.logger.warn(message);
  }
}