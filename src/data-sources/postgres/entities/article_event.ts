import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Article } from './article';
import { BaseEntity } from './base';

@Entity()
export class ArticleEvent extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'uuid' })
    article_id?: string;

    @Column()
    event_name!: string;

    @Column({ type: 'integer' })
    article_version!: number;
}
