import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';
import { config } from '@users/config';
import { winstonLogger } from '@users/utils/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'elastic search server', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;
  try {
    const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
    log.info(`users service elastic search health status - ${health.status}`);
    isConnected = true;
  } catch (error) {
    log.error('connection to Elastic search faild .. retrying ...');
    log.log('error', 'users service checkConnection() : ', error);
    process.exit(-1);
  }
};

export { checkConnection };
