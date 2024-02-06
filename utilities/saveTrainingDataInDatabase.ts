// Generate a unique filename, e.g., based on the current timestamp

import { PrismaClient } from '@prisma/client';
import consola from 'consola';
import {
  Label,
  Platform,
  TrainingItem,
  TrainingItems,
} from 'types/training-items';

// Convert the labels to the correct format for the database
// Load in the data-all.json file and iterate over the following keys for each
// itemId.  Any values found, assign to the labels array.
// const labelNames = ['labels', 'proficiencies', 'tools', 'advancedSkills'];

// Create an array of objects to be used in the database
// const labelObjects = labelNames.map((name) => ({
//   connect: { name },
// }));

export default async function saveTrainingDataInDatabase(
  platform: Platform,
  items: TrainingItems['items'],
) {
  try {
    // Create database records for all training items
    const prisma = new PrismaClient();
    items.map(async (item) => {
      const { labels, ...rest } = item;
      const labelsArray = labels
        ?.split(',')
        .map((label: Label) => ({ name: label }));
      const trainingItem = {
        ...rest,
      };
      const saveLabels = labelsArray.map(async (label) => {
        const saveLabel = await prisma.labels.upsert({
          where: { name: label.name },
          update: {},
          create: {
            name: label.name,
            categoryId: 0,
          },
        });
      });
      const saveTrainingItem: TrainingItem = await prisma.trainingItem.upsert({
        where: { id: trainingItem.id },
        update: {},
        create: {
          ...trainingItem,
        },
      });
    });
    consola.info(`Saved training items from ${platform} API to the database`);
  } catch (error) {
    consola.error(
      new Error(`Failed to save training items to the database:`),
      error,
    );
  }
}
