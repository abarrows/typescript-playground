// // Generate a unique filename, e.g., based on the current timestamp
// import { labels } from '@prisma/client';
// import consola from 'consola';
// import { NextResponse } from 'next/server';

// import { Label } from '@/types/training-items';
// import { database } from '@/utilities/prisma';

// // Convert the labels to the correct format for the database
// // Load in the data-all.json file and iterate over the following keys for each
// // itemId.  Any values found, assign to the labels array.
// // const labelNames = ['labels', 'proficiencies', 'tools', 'advancedSkills'];

// export default async function saveTrainingDataLabels({
//   labels: labels,
// }: {
//   labels: Label[];
// }) {
//   if (labels.length === 0) {
//     consola.info('No labels were found.');
//     return;
//   }
//   for (const label of labels) {
//     const existingLabel: Label | null = await database.labels.findFirst({
//       where: {
//         name: label.name,
//         categoryName: label.categoryName,
//       },
//     });
//     if (!existingLabel) {
//       consola.trace(
//         `Label ${label.name} did NOT exist in the database, creating it now.`,
//       );
//       const createLabel: labels = await database.labels.upsert({
//         where: { name: `${label.name}`, categoryName: label.categoryName },
//         update: {},
//         create: {
//           name: `${label.name}`,
//           categoryName: label.categoryName,
//         },
//       });
//     } else {
//       consola.log(
//         `Label "${label.name}" already existed for item: ${label.categoryName} in the database.`,
//       );
//     }
//   }
//   return new NextResponse(JSON.stringify(labels));
// }
