import { ConfluenceClient } from 'confluence.js';
import consola from 'consola';
import { env } from 'env.mjs';

import consoleLogger from '@/utilities/consoleLogger';

type BasicAuthentication = {
  email: string;
  apiToken: string;
};
const client: ConfluenceClient = new ConfluenceClient({
  host: `https://${process.env.CONFLUENCE_DOMAIN}.atlassian.net`,
  // apiPrefix: '/api',
  authentication: {
    basic: {
      email: env.CONFLUENCE_USERNAME,
      apiToken: env.CONFLUENCE_API_TOKEN,
    } as BasicAuthentication,
  },
});
export async function GET(): Promise<void> {
  consoleLogger('Platform Domain', process.env.CONFLUENCE_DOMAIN);

  interface ConfluenceApiResponse extends Omit<Response, 'data'> {
    data: () => {
      message: string;
    };
  }

  // interface ConfluenceArticle {
  //   title: string;
  //   url: string;
  //   excerpt: string;
  // }

  // async function getSearchResults() {
  //   const labelToSearch = await client.search.search({
  //     cql: 'label="acb-review"',
  //     limit: 5,
  //   });

  //   return labelToSearch;

  //   // const searchResults = await client.search.search({
  // }
  try {
    const res: ConfluenceApiResponse = await client.search.search({
      cql: 'label="acb-review"',
      limit: 5,
    });
    const data = await res;
    return Response.json(data);
  } catch (error) {
    consola.error(new Error('Failed to fetch from Confluence API:'), error);
  }
}
