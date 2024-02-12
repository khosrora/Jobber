import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { winstonLogger } from '@khosrora/jobber-shared';
import { Logger } from 'winston';
import { config } from './config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'elastic search server', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

export async function checkConnection(): Promise<void> {
  let isConnected = false;
  try {
    const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
    log.info(`notification service elastic search health status - ${health.status}`);
    isConnected = true;
    console.log(isConnected);
  } catch (error) {
    log.error('connection to Elastic search faild .. retrying ...');
    log.log('error', 'notification service checkConnection() : ', error);
    process.exit(-1)
  }
}
