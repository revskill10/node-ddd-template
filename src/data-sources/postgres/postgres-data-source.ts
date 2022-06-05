import 'module-alias';
import { DataSource } from "typeorm"
import { OrmConfig } from './ormconfig';
export const postgresDataSource = new DataSource(OrmConfig)