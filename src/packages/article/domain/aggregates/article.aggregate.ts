import { AggregateRoot, BaseDomainEntity, IDomainEvent, Result, DomainId } from 'types-ddd';
import ArticleTitleValueObject from 'src/packages/article/domain/value-objects/article-title.value-object';
import ArticleCreatedEvent from '../events/article-created.event';
import ArticleTitleChangedEvent from '../events/article-title-changed.event';
export interface ArticleProps extends BaseDomainEntity {
	title: ArticleTitleValueObject;
}

class ArticleAggregate extends AggregateRoot<ArticleProps> {
	private events: IDomainEvent[];

	private constructor(props: ArticleProps) {
		super(props, ArticleAggregate.name);
		this.events = [];
	}

	get title(): ArticleTitleValueObject {
		return this.props.title;
	}

	addEvent(event: IDomainEvent) {
		this.events.push(event);
	}

	getEvents() { return this.events; }

	changeTitle(newTitle: ArticleTitleValueObject): Result<ArticleAggregate> {
		if (this.props.title.equals(newTitle)) return Result.ok(this);
		this.addEvent(new ArticleTitleChangedEvent(this, newTitle));
		this.props.title = newTitle;
		return Result.ok(this);
	}

	public static create(props: ArticleProps): Result<ArticleAggregate> {
		const newArticle = new ArticleAggregate(props);
		newArticle.addEvent(new ArticleCreatedEvent(newArticle, props));
		return Result.ok(newArticle);
	}

	_apply(event: IDomainEvent): ArticleAggregate {
		if (event instanceof ArticleCreatedEvent) {
			return this.clone({
				idStrategy: "uuid",
				isNew: false,
				props: event.props
			}).getResult();
		}
		if (event instanceof ArticleTitleChangedEvent) {
			this.props.title = event.title;
		}
		return this;
	}

	public static applyEvents(article: ArticleAggregate, events: IDomainEvent[]): ArticleAggregate {
		let newArticle = article;
		for (let i = 0; i < events.length; i++) {
			newArticle = newArticle._apply(events[i]);
		}
		return newArticle;
	}
}

export default ArticleAggregate;
