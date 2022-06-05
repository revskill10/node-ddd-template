import { DataSource, EntityManager, ObjectLiteral, QueryRunner, Repository } from "typeorm";
import { IUnitOfWork } from "../unit-of-work";
import { postgresDataSource } from './postgres-data-source';

export class TypeOrmUnitOfWork implements IUnitOfWork {
    private readonly asyncDatabaseConnection: DataSource;
    private readonly queryRunner: QueryRunner;
    private transactionManager: EntityManager | undefined;
  
    constructor(
        asyncDatabaseConnection: DataSource = postgresDataSource
    ) {
      this.asyncDatabaseConnection = asyncDatabaseConnection;
      this.queryRunner = this.asyncDatabaseConnection.createQueryRunner();
    }

    withRepository<R extends Repository<ObjectLiteral>>(repository: R): R {
        if (!this.transactionManager) throw new Error('must call start()');
        return this.transactionManager.withRepository(repository);
    }

    getTranactionManager() {
        return this.transactionManager;
    }
  
    setTransactionManager() {
      this.transactionManager = this.queryRunner.manager;
    }
  
    async start() {
      await this.queryRunner.startTransaction();
      this.setTransactionManager();
    }
  
    async complete(work: (uow: TypeOrmUnitOfWork) => void) {
      try {
        await work(this);
        await this.queryRunner.commitTransaction();
      } catch (error) {
        await this.queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await this.queryRunner.release();
      }
    }
  }