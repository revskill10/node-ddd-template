import { Filter, TMapper, Logger } from 'types-ddd';
import { IAggregateRepository } from 'src/packages/article/repositories/aggregate.repository-interface';
import ArticleAggregate from 'src/packages/article/domain/aggregates/article.aggregate';
import { Article, Article as ArticleModel } from '../entities/article';
import { ArticleRepository } from './article.repository';
import { ArticleDomainMapper, ArticleMapper } from '../../../packages/article/data-mappers/aggregates/article-postgres.mapper';
import { Repository } from 'typeorm';
import { ArticleEvent } from '../entities/article_event';
import { ArticleEventRepository } from './article-event.repository';

export class ArticleAggregatePostgresRepository implements IAggregateRepository<ArticleAggregate, ArticleModel>{

	private readonly mapper: TMapper<ArticleAggregate, ArticleModel> = new ArticleMapper();
	private readonly domainMapper: TMapper<ArticleModel, ArticleAggregate> = new ArticleDomainMapper()

	constructor(
		private readonly repository: Repository<Article> = ArticleRepository,
		private readonly eventRepo: Repository<ArticleEvent> = ArticleEventRepository
	) { }

	getModels(): Promise<Article[]> {
		return ArticleRepository.find({
			take: 10
		});
	};

	async save(target: ArticleAggregate): Promise<void> {
		try {
			const events = target.getEvents();
			if (events.length === 0) return;
			const modelOrFail = this.mapper.map(target);

			if (modelOrFail.isFailure) return;
			const model = modelOrFail.getResult();
			model.version = model.version ? model.version + 1 : 1;
			const mappedEvents: ArticleEvent[] = events.map(evt => {
				return {
					article_version: model.version || 1,
					article_id: model.id,
					event_name: evt.constructor.name
				}
			});
			await this.eventRepo.save(mappedEvents);
			await this.repository.save(model);

			// Execute hooks on mark task as done
			Logger.info('[Task]: New task added');
		} catch (err) {
			throw err;
		}

	};

	async findOneAggregate(filter: Filter<Partial<Article>>): Promise<ArticleAggregate | null> {
		const found = await this.repository.findOne({
			where: {
				id: filter.id
			}
		})

		if (!found) {
			return null;
		}
		return this.domainMapper.map(found).getResult();
	};

	async exists(filter: Filter<Partial<ArticleModel>>): Promise<boolean> {
		const userFound = await this.findOneAggregate(filter);
		const exists = !!userFound;
		return exists;
	};

}

export default ArticleAggregatePostgresRepository;
