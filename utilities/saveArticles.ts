import fs from 'fs';
// Generate a unique filename, e.g., based on the current timestamp

import path from 'path';

import consola from 'consola';

export type Platform = 'confluence' | 'jira' | 'github' | 'google';

// Now create a type or an interface which is an object containing a platform
// value and another key called items which is an array of ConfluenceArticles

type ConfluenceArticles = {
  platform: Platform;
  items: ConfluenceArticle[];
};

type ConfluenceArticle = {
  title: string;
  url: string;
  excerpt: string;
  // body: string;
};

export default async function saveArticles(
  platform: Platform,
  items: ConfluenceArticles['items'],
) {
  items.map((item, index: number) => {
    const filename = `${platform}-article-${index}-current.json`;
    const filepath = path.join(
      process.cwd(),
      'data/training/confluence/',
      filename,
    );

    try {
      // Write the data to a file in the 'training-data' directory
      fs.writeFileSync(filepath, JSON.stringify(item, null, 2), 'utf-8');
    } catch (error) {
      consola.error(new Error('Failed to fetch from Confluence API:'), error);
    }
  });
}
