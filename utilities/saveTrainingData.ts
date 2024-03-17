import fs from 'fs';
// Generate a unique filename, e.g., based on the current timestamp

import path from 'path';

import consola from 'consola';

import {
  Platform,
  RecommendedItem,
  TrainingItem,
} from '@/types/training-items';

// Now create a type or an interface which is an object containing a platform
// value and another key called items which is an array of ConfluenceArticles

// Create an interface which is an array of TrainingItems

export default async function saveTrainingData(
  platform: Platform,
  items: RecommendedItem[],
) {
  try {
    // const itemsWithoutBody = items.map((item: TrainingItem) => {
    //   // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
    //   const { body, ...rest } = item;
    //   return rest;
    // });
    const itemsInJson = JSON.stringify(items, null, 2);
    fs.writeFileSync(
      `data/training/${platform}/data-all.json`,
      itemsInJson,
      'utf-8',
    );
  } catch (error) {
    consola.error(
      new Error(`Failed to save all training items from ${platform} API:`),
      error,
    );
  }
  // Save all training items from the platform API to a JSON file
  items.map((item: TrainingItem) => {
    try {
      // Write the data to a file in the 'training-data' directory
      const filename = `${item.key.replaceAll('/spaces/', '')}-${item.id}.json`;
      const filepath = path.join(
        process.cwd(),
        `data/training/${platform}/`,
        filename,
      );
      fs.writeFileSync(filepath, JSON.stringify(item, null, 2), 'utf-8');
    } catch (error) {
      consola.error(new Error(`Failed to fetch from ${platform} API:`), error);
    }
  });
}
