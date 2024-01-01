import { ConfluenceClient } from 'confluence.js';
import consola from 'consola';
import { env } from 'env.mjs';

import { consoleLogger } from '@/utilities/consoleLogger';

type BasicAuthentication = {
  email: string;
  apiToken: string;
};

const platform: string = 'confluence';

const client: ConfluenceClient = new ConfluenceClient({
  host: `https://${process.env.CONFLUENCE_DOMAIN}.atlassian.net`,
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

  try {
    // Call the ConfluenceAPI and search using cql with the label="acb-review"
    // and expand to get the labels and the body of the article
    const res: ConfluenceApiResponse = await client.search.search({
      cql: 'label="acb-review"',
      expand: ['body'],
      limit: 5,
    });

    const data: ConfluenceApiResponse | void = await res;
    return Response.json(data);
  } catch (error) {
    consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
  }
}
