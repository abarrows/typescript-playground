import consola from 'consola';
import { Version3Client } from 'jira.js';
import { Issue } from 'jira.js/out/agile';
import { Labels } from 'jira.js/out/version2';
import { NextResponse } from 'next/server';

import { RecommendedItem } from '@/types/training-items';
import bodyToMarkdown from '@/utilities/bodyToMarkdown';
// import { trainingItems } from '@/data/training/gpt-recommendations/data.json';
import { consoleLogger } from '@/utilities/consoleLogger';

type BasicAuthentication = {
  email: string;
  apiToken: string;
};

interface JiraApiResponse extends Omit<Response, 'data'> {
  data: () => {
    message: string;
  };
}

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

  try {
    const res: JiraApiResponse =
      await client.issueSearch.searchForIssuesUsingJql({
        jql: 'labels="acb-review"',
        maxResults: 100,
        fields: ['*navigable'],
      });
    const data = await res;
    const items: Issue[] = data?.issues;

    // const recommendedItems = trainingItems.items;
    const populatedItems: RecommendedItem[] = [];
    // Iterate through results and normalize into the training data format.
    const normalizedItems = await items.map((item: Issue) => {
      // Push each issue with only the selected fields into the
      // normalizedJiraResults array.

      // const matchingRecommendedItem: RecommendedItem | null | undefined =
      // recommendedItems.find(
      //   (recommendedItem) => recommendedItem?.itemId === item.content.id,
      //   );

      // Use the function
      const markdownDescription = item?.fields?.description
        ? bodyToMarkdown(item?.fields.description)
        : '';
      const populatedItem: RecommendedItem = item && {
        id: item.id,
        itemId: item.id,
        key: item.key,
        url: `${process.env.CONFLUENCE_DOMAIN}/${item.url}`,
        title: item.fields.summary,
        excerpt: item.fields.summary.replace(/<(?!br\s*\/?)[^>]+>/gi, '') || '',
        body: markdownDescription,
        labels: [
          // ...(matchingRecommendedItem?.proficiencies?.map((label: string) => ({
          //   name: label,
          //   categoryId: 0,
          // })) || []),
          // ...(matchingRecommendedItem?.tools?.map((label: string) => ({
          //   name: label,
          //   categoryId: 1,
          // })) || []),
          // ...(matchingRecommendedItem?.advancedSkills?.map((label: string) => ({
          //   name: label,
          //   categoryId: 2,
          // })) || []),
          ...(item?.fields?.labels?.map((label: Labels) => ({
            name: label,
            categoryId: 3,
          })) || []),
        ],
      };

      populatedItems.push(populatedItem);

      // Check the populatedItems array to see if there are any duplicated
      // items and remove any after the first one.

      const seen = new Set();
      const filteredItems = populatedItems.filter((item) => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });
      populatedItems.length = 0;
      populatedItems.push(...filteredItems);

      return populatedItems;
    });

    return NextResponse.json(populatedItems);
  } catch (error) {
    consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
  }
}
