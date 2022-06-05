import { Article } from '../entities/article';
import { postgresDataSource } from '../postgres-data-source';

export const ArticleRepository = postgresDataSource.getRepository(Article);