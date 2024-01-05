import consola from 'consola';
import { Version3Client } from 'jira.js';

import { consoleLogger } from '@/utilities/consoleLogger';

type BasicAuthentication = {
  email: string;
  apiToken: string;
};

const platform = 'Jira';

const client: Version3Client = new Version3Client({
  host: `${process.env.JIRA_DOMAIN}`,
  // apiPrefix: '/api',
  authentication: {
    basic: {
      email: process.env.JIRA_USERNAME,
      apiToken: process.env.JIRA_API_TOKEN,
    } as BasicAuthentication,
  },
});
export async function GET(): Promise<void> {
  consoleLogger('Platform Domain', process.env.JIRA_DOMAIN);

  interface JiraApiResponse extends Omit<Response, 'data'> {
    data: () => {
      message: string;
    };
  }

  try {
    const res: JiraApiResponse =
      await client.issueSearch.searchForIssuesUsingJql({
        jql: 'labels="acb-review"',
        maxResults: 100,
        fields: ['*navigable'],
      });
    const data = await res;
    return Response.json(data);
  } catch (error) {
    consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
  }
}
