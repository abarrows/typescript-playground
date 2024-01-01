import fs from 'fs';
// Generate a unique filename, e.g., based on the current timestamp

import path from 'path';

import consola from 'consola';

export type Platform = 'confluence' | 'jira' | 'github' | 'google';

// Now create a type or an interface which is an object containing a platform
// value and another key called items which is an array of ConfluenceArticles

type TrainingItems = {
  platform: Platform;
  items: TrainingItem[];
};

export interface TrainingItem {
  title: string;
  url: string;
  body: string;
  id: string;
  key: string;
}

export default async function saveTrainingData(
  platform: Platform,
  items: TrainingItems['items'],
) {
  items.map((item: TrainingItem, index: number) => {
    const filename = `${platform}-${item.key}-${item.id}.json`;
    const filepath = path.join(
      process.cwd(),
      `data/training/${platform}/`,
      filename,
    );

    try {
      // Write the data to a file in the 'training-data' directory
      fs.writeFileSync(filepath, JSON.stringify(item, null, 2), 'utf-8');
    } catch (error) {
      consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
    }
  });
}
