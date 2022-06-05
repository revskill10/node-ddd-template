import { ObjectLiteral, Repository } from "typeorm";

export interface IUnitOfWork {
    start(): void;
    complete(work: () => void): Promise<void>;
    withRepository<R extends Repository<ObjectLiteral>>(repository: R): R;
}