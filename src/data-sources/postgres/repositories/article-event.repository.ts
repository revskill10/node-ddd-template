import { ArticleEvent } from '../entities/article_event';
import { postgresDataSource } from '../postgres-data-source';

export const ArticleEventRepository = postgresDataSource.getRepository(ArticleEvent);