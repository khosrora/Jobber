import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';
import { config } from './config';
import { winstonLogger } from './utils/Logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'elastic search server', 'debug');

class ElasticSearch {
  private elasticSearchClient: Client;
  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      log.info('gatway service connecting to elastic search');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health({});
        log.info(`gatway Service elastic search health - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('connection to elastic search faild , retrying...');
        log.log('error', 'connection to elastic search faild , retrying...', 'error');
      }
    }
  }
}

export const elasticsearch: ElasticSearch = new ElasticSearch();
