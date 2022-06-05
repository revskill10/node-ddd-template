import { IDomainEvent, UniqueEntityID } from 'types-ddd';
import ArticleAggregate, { ArticleProps } from 'src/packages/article/domain/aggregates/article.aggregate';

export class ArticleCreatedEvent implements IDomainEvent {
	public dateTimeOccurred: Date;
	public article: ArticleAggregate;
	public props: ArticleProps;

	constructor(
		article: ArticleAggregate,
		props: ArticleProps
	) {
		this.article = article;
		this.dateTimeOccurred = new Date();
		this.props = props;
	}

	getAggregateId(): UniqueEntityID {
		return this.article.id.value;
	}

}

export default ArticleCreatedEvent;
