import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @CreateDateColumn()
    public created_at?: Date;

    @UpdateDateColumn()
    public updated_at?: Date;
}
