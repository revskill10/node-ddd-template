import { DataSource } from 'typeorm';
import { postgresDataSource } from './postgres-data-source';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { Pool } from 'pg';

import { sleep } from 'src/utils/sleep';
import { logger } from 'src/utils/logger';
import { IS_TEST } from 'src/data-sources/config';

// Handles unstable/intermitten connection lost to DB
function connectionGuard(connection: DataSource) {
    // Access underlying pg driver
    if (connection.driver instanceof PostgresDriver) {
        const pool = connection.driver.master as Pool;

        // Add handler on pool error event
        pool.on('error', async (err: Error) => {
            logger.error(err, 'Connection pool erring out, Reconnecting...');
            try {
                await connection.destroy();
            } catch (innerErr: any) {
                logger.error(innerErr, 'Failed to close connection');
            }
            while (!connection.isInitialized) {
                try {
                    await connection.initialize(); // eslint-disable-line
                    logger.info('Reconnected DB');
                } catch (error: any) {
                    logger.error(error, 'Reconnect Error');
                }

                if (!connection.isInitialized) {
                    // Throttle retry
                    await sleep(500); // eslint-disable-line
                }
            }
        });
    }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
// 3.a. We rethrow the connection error in test mode to prevent open handles issue in Jest
export async function connect(): Promise<void> {
    let connection: DataSource | undefined;
    let isConnected = false;

    logger.info('Connecting to DB...');
    while (!isConnected) {
        try {
            connection = await postgresDataSource.initialize(); // eslint-disable-line
            isConnected = connection.isInitialized;
        } catch (error: any) {
            logger.error(error, 'createConnection Error');

            if (IS_TEST) {
                throw error;
            }
        }

        if (!isConnected) {
            // Throttle retry
            await sleep(500); // eslint-disable-line
        }
    }

    logger.info('Connected to DB');
    if (connection && connection.isInitialized) connectionGuard(connection);
}
