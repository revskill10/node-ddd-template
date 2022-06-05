import ArticleTitleValueObject from '../article-title.value-object';

describe('ArticleTitleValueObject', () => {
	it('should create an invalid aggregate', ()=>{
		const title = ArticleTitleValueObject.create('ti');
		expect(title.isFailure).toBeTruthy();
	});

	it('should create a valid aggregate', ()=>{
		const title = ArticleTitleValueObject.create('tisd');
		expect(title.isSuccess).toBeTruthy();
	});
});