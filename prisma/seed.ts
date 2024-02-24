import { dataLabels } from '../data/categories';
import { database } from '../utilities/prisma';

async function main() {
  const dataLabelCategories: string[] = [
    'proficiencies',
    'tools',
    'advancedSkills',
    'original',
  ];

  // Seed all the labelCategories first using the dataLabelCategories array
  let categoryIndex = 0;
  for (const categoryName of dataLabelCategories) {
    await database.label_categories.upsert({
      where: { id: categoryIndex },
      update: {},
      create: {
        id: categoryIndex,
        name: `${categoryName}`,
      },
    });
    categoryIndex++;
  }

  // Now iterate over the the dataLabelCategories array and match the key with
  // the object's labels within the labelData object.  Seed these labels into
  // the database.
  // Iterate over the entire dataLabels array and seed each label into the
  // database.

  for (const label of dataLabels) {
    await database.labels.upsert({
      where: {
        name_categoryId: { name: label.name, categoryId: label.categoryId },
      },
      update: {},
      create: {
        categoryId: label.categoryId,
        name: `${label.name}`,
      },
    });
  }

  // const item1 = await database.trainingItem.upsert({
  //   where: { itemId: '1027244033' },
  //   update: {},
  //   create: {
  //     itemId: '1027244033',
  //     title: '2020 Process Improvements (IN PROGRESS)',
  //     excerpt:
  //       'Goals\n\nPriority List\nTask\nActionable\nCompleted Date\nOutcome\nNeed to have convo with POs on major, minor version numbers\n4 digits:\n1st digit = PO determines\n2nd = major\n3rd = minor\n4th = patch\nPOs, producers, and devs will talk about major releases.\nHow to organize Jira as we move to more, smaller applications and services',
  //     labels: {
  //       connect: [
  //         { name: 'acb-review' },
  //         { name: 'houseclean-review' },
  //         { name: 'Jira' }, // Assuming 'Jira' is a label under 'tools'
  //         { name: 'Project Management' }, // Assuming this is a label under 'advanced-skills'
  //         { name: 'Technical Management' }, // Assuming this is a label under 'advanced-skills'
  //       ],
  //     },
  //     key: '/spaces/DPKB',
  //     body: 'This is just a seed',
  //     url: 'https://confluence.com/wiki/spaces/DPKB/pages/1027244033',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  // const item2 = await database.trainingItem.upsert({
  //   where: { itemId: '1027244034' },
  //   update: {},
  //   create: {
  //     itemId: '1027244034',
  //     title: 'Digital Products ­ Critical First 5 Steps',
  //     excerpt:
  //       'Digital Products ­ Critical First 5 Steps\n1. Prioritization Meeting\nEach team member writes (In their opinion) the most important 5 project/milestones on sticky notes. Each project sticky note would contain:\nProject Name\nList of Benefits\nCost Estimate (IE: 1 resource for 3 days)\nOver the course of an afternoon, we all discuss',
  //     labels: {
  //       connect: [
  //         { name: 'documentation' },
  //         { name: 'workflows' },
  //         { name: 'historical-reference' },
  //         { name: '2015' },
  //         { name: 'orientation-cdo' },
  //         { name: 'acb-migration' },
  //         { name: 'acb-review' },
  //         { name: 'Jira' },
  //         { name: 'Confluence' },
  //         { name: 'Project Management' },
  //         { name: 'Technical Management' },
  //       ],
  //     },
  //     key: '/spaces/TD',
  //     body: 'This is just a seed.',
  //     url: 'https://confluence.com/wiki/spaces/TD/pages/1015900',
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // });

  // console.log('The training items are: ', item1, item2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await database.$disconnect();
  });
