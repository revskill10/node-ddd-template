import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArticleEvent } from './article_event';
import { BaseEntity } from './base';

@Entity()
export class Article extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column()
    title!: string;

    @Column({ type: 'integer', default: 1 })
    version?: number;
}
