import { ValueObject, Result } from 'types-ddd';

type ArticleTitleProp = {
	value: string
};

export class ArticleTitleValueObject extends ValueObject<ArticleTitleProp>{
	private constructor (props: ArticleTitleProp){
		super(props);
	}

	get value (): string {
		return this.props.value.toLowerCase();
	}

	public static isValidValue (value:string): boolean {
		return value.length >= 3 && value.length <= 140;
	}

	public static create (value: string): Result<ArticleTitleValueObject>{
		
		const isValidValue = ArticleTitleValueObject.isValidValue(value);

		if(!isValidValue) {
			return Result.fail(
				'Invalid Article Title. Must has Min 3 and Max 140 chars', 
				'UNPROCESSABLE_ENTITY'
			);
		}

		return Result.ok(new ArticleTitleValueObject({ value }));
	}
}

export default ArticleTitleValueObject;
