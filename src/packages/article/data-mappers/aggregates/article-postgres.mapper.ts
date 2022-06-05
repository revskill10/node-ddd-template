import { TMapper, DomainId, Result } from 'types-ddd';
import ArticleAggregate from 'src/packages/article/domain/aggregates/article.aggregate';
import { Article as ArticleModel } from 'src/data-sources/postgres/entities/article';
import ArticleTitleValueObject from 'src/packages/article/domain/value-objects/article-title.value-object';

export class ArticleMapper implements TMapper<ArticleAggregate, ArticleModel>{
	map(target: ArticleAggregate): Result<ArticleModel, string> {
		return Result.ok({
			id: target.id.value.toString(),
			title: target.title.value,
		});
	}
}

export class ArticleDomainMapper implements TMapper<ArticleModel, ArticleAggregate> {
	map(target: ArticleModel): Result<ArticleAggregate, string> {
		return ArticleAggregate.create(
			{
				ID: DomainId.create(target.id),
				title: ArticleTitleValueObject.create(target.title).getResult(),
			}
		);
	}
}
