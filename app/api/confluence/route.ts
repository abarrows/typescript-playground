import { ConfluenceClient } from 'confluence.js';
import { GetContentById, SearchByCQL } from 'confluence.js/out/api/parameters';
import consola from 'consola';
import { NextResponse } from 'next/server';

type BasicAuthentication = {
  email: string;
  apiToken: string;
};

const platform: string = 'confluence';

const client: ConfluenceClient = new ConfluenceClient({
  host: `${process.env.CONFLUENCE_DOMAIN}`,
  authentication: {
    basic: {
      email: process.env.CONFLUENCE_USERNAME,
      apiToken: process.env.CONFLUENCE_API_TOKEN,
    } as BasicAuthentication,
  },
});
export async function GET(): Promise<void> {
  consola.info('Platform Domain', process.env.CONFLUENCE_DOMAIN);

  try {
    // Call the ConfluenceAPI and search using cql with the label="acb-review"
    // and expand to get the labels and the body of the article
    const res: SearchByCQL = await client.search.searchByCQL({
      cql: `${process.env.CONFLUENCE_API_QUERY}`,
      limit: 210,
      expand: ['body.view', 'metadata.labels'],
    });
    const items = res.results;
    const populatedItems = [];
    // Iterate through results and normalize into the training data format.
    const normalizedItems: GetContentById = async (items) => {
      for (const item of items) {
        const itemContents = await client.content.getContentById({
          id: item.content.id,
          expand: ['body.view', 'metadata.labels'],
        });
        consola.info(
          `Item: ${
            item.content.title
          } | Labels: ${itemContents.metadata.labels.results
            .map((label: string) => label.name)
            .join(', ')}`,
        );
        const populatedItem = itemContents && {
          id: item.content.id,
          key: item.resultGlobalContainer.displayUrl,
          url: `${process.env.CONFLUENCE_DOMAIN}${item.url}`,
          title: item.title,
          excerpt: item.excerpt,
          body: itemContents.body.view.value,
          labels: itemContents.metadata.labels.results,
        };
        if (item.content.id) populatedItems.push(populatedItem);
      }

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
    };
    await normalizedItems(items);

    return NextResponse.json({ populatedItems });
  } catch (error) {
    consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
  }
}
