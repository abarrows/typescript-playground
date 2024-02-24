// Generate a unique filename, e.g., based on the current timestamp
import consola from 'consola';

import { Platform, RecommendedItem } from '@/types/training-items';
import { database } from '@/utilities/prisma';

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
  items: RecommendedItem[],
) {
  // store the id, itemId, title, proficiencies, tools, advancedSkills that exist in /data/training/confluence/data-all.json
  // and

  // Create database records for all training items
  // Set the default value for each of the labels, proficiencies, tools,
  // advancedSkills to an empty array.
  for (const item of items) {
    const { labels, ...itemWithoutLabels } = item;
    consola.trace(`The item is ${item}`);
    // Assign all original labels to categoryId 3
    // const groupedLabels = [
    //   ...labels,
    //   ...proficiencies,
    //   ...tools,
    //   ...advancedSkills,
    // ];

    // Remove any blank labels
    // const allLabels: Label[] = groupedLabels.filter(
    //   (label) => label.name !== '',
    // );
    for (const label of labels) {
      const existingLabel = await database.labels.findFirst({
        where: {
          id: label.id,
        },
      });
      if (existingLabel) {
        consola.trace(
          `Label ${existingLabel.name} already exists, removing it.`,
        );
        // Remove the label from the array
        labels.splice(labels.indexOf(label), 1);
      }
    }

    // Save the entire training item to the database
    await database.trainingItem.upsert({
      where: { itemId: itemWithoutLabels.itemId },
      update: { itemId: item.itemId },
      create: {
        ...itemWithoutLabels,
        labels: {
          connectOrCreate: labels.map((label) => ({
            where: {
              name_categoryId: {
                name: label.name,
                categoryId: label.categoryId,
              },
            },
            create: { name: label.name, categoryId: label.categoryId },
          })),
        },
      },
    });
    consola.info(
      `Saved training items from ${itemWithoutLabels.title} API to the database`,
    );
  }
}
