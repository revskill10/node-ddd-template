import { Filter } from 'types-ddd';

export interface IAggregateRepository<Aggregate, Model> {
	save: (target: Aggregate) => Promise<void>
	findOneAggregate: (filter: Filter<Partial<Model>>) => Promise<Aggregate | null>
	getModels: () => Promise<Model[]>
}

export default IAggregateRepository;
