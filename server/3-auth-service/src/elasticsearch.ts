import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { winstonLogger } from '@auth/utils/logger';
import { ISellerGig } from '@auth/utils';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'elastic search server', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('auth service connectig to elastic search ...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`auth service elastic search health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('connection to Elastic search faild .. retrying ...');
      log.log('error', 'auth service checkConnection() : ', error);
      process.exit(-1);
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({
    index: indexName
  });
  return result;
}

async function createsIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist. `);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`an error occureed while creating the index ${indexName}`);
    log.log('error', 'auth service createsIndex() method error : ', error);
  }
}

async function getDocumentsById(index: string, gigId: string): Promise<ISellerGig> {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId
    });
    return result._source as ISellerGig;
  } catch (error) {
    log.log('error', 'auth elastic search getDocumentsById() method error : ', error);
    return {} as ISellerGig;
  }
}

export { elasticSearchClient, checkConnection, createsIndex, getDocumentsById };
