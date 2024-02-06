import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LabelData = [Label[]];

type Label = {
  categoryId: number;
  name: string;
};

async function main() {
  const dataLabelCategories: string[] = [
    'advancedSkills',
    'proficiencies',
    'tools',
    'original',
  ];
  const dataLabels = [
    { categoryId: 0, name: 'Accessibility' },
    { categoryId: 0, name: 'Application Security' },
    { categoryId: 0, name: 'Artificial Intelligence' },
    { categoryId: 0, name: 'Automated Testing And QA' },
    { categoryId: 0, name: 'Back-End Web Development' },
    { categoryId: 0, name: 'Client-side Debugging' },
    { categoryId: 0, name: 'Cloud Hosting and Operations' },
    { categoryId: 0, name: 'CMS Systems' },
    {
      categoryId: 0,
      name: 'Continuous Integration, Build Process and Delivery',
    },
    { categoryId: 0, name: 'Data Science And Analytics' },
    { categoryId: 0, name: 'Developer Experience' },
    { categoryId: 0, name: 'Development Operations' },
    { categoryId: 0, name: 'Digital Marketing' },
    { categoryId: 0, name: 'Ecommerce Systems' },
    { categoryId: 0, name: 'Email Campaigns & Templates' },
    { categoryId: 0, name: 'Front-End Web Development' },
    { categoryId: 0, name: 'Information Architecture' },
    { categoryId: 0, name: 'Online Compliance' },
    { categoryId: 0, name: 'Programmatic Advertising' },
    { categoryId: 0, name: 'Project Management' },
    { categoryId: 0, name: 'SEO' },
    { categoryId: 0, name: 'Software Architecture' },
    { categoryId: 0, name: 'Team Environment and Tooling' },
    { categoryId: 0, name: 'Technical Architecture' },
    { categoryId: 0, name: 'Technical Management' },
    { categoryId: 0, name: 'Third Party Advertising' },
    { categoryId: 0, name: 'User Behavior Analytics' },
    { categoryId: 0, name: 'User Experience Design' },
    { categoryId: 0, name: 'Web Performance' },
    { categoryId: 1, name: 'HTML5' },
    { categoryId: 1, name: 'CSS' },
    { categoryId: 1, name: 'Javascript' },
    { categoryId: 1, name: 'React' },
    { categoryId: 1, name: 'Babel' },
    { categoryId: 1, name: 'TypeScript' },
    { categoryId: 1, name: 'Markdown' },
    { categoryId: 1, name: 'XML' },
    { categoryId: 1, name: 'UML' },
    { categoryId: 1, name: 'YAML' },
    { categoryId: 1, name: 'Bootstrap' },
    { categoryId: 1, name: 'NodeJs' },
    { categoryId: 1, name: 'Jest' },
    { categoryId: 1, name: 'Playwright' },
    { categoryId: 1, name: 'JSON' },
    { categoryId: 1, name: 'Python' },
    { categoryId: 1, name: 'Django' },
    { categoryId: 1, name: 'Svelte' },
    { categoryId: 1, name: 'Next.js' },
    { categoryId: 1, name: 'Java' },
    { categoryId: 1, name: 'Ruby' },
    { categoryId: 1, name: 'Rails' },
    { categoryId: 1, name: 'PHP' },
    { categoryId: 1, name: 'Bash' },
    { categoryId: 1, name: 'Powershell' },
    { categoryId: 1, name: 'ZSH' },
    { categoryId: 1, name: 'Git' },
    { categoryId: 1, name: 'MySQL' },
    { categoryId: 1, name: 'Postgres' },
    { categoryId: 1, name: 'Mongo' },
    { categoryId: 1, name: 'Docker' },
    { categoryId: 1, name: 'Kubernetes' },
    { categoryId: 2, name: 'Photoshop' },
    { categoryId: 2, name: 'Illustrator' },
    { categoryId: 2, name: 'Adobe Xd' },
    { categoryId: 2, name: 'Figma' },
    { categoryId: 2, name: 'Omni-Graffle' },
    { categoryId: 2, name: 'Draw.Io' },
    { categoryId: 2, name: 'Vs Code' },
    { categoryId: 2, name: 'Jetbrains Ides' },
    { categoryId: 2, name: 'Docker Desktop' },
    { categoryId: 2, name: 'Github Codespaces' },
    { categoryId: 2, name: 'K9s' },
    { categoryId: 2, name: 'Github Actions' },
    { categoryId: 2, name: 'Github Copilot' },
    { categoryId: 2, name: 'Wordpress' },
    { categoryId: 2, name: 'Outlook 365' },
    { categoryId: 2, name: 'Chat GPT' },
    { categoryId: 2, name: 'Jira' },
    { categoryId: 2, name: 'Confluence' },
    { categoryId: 2, name: 'iTerm' },
    { categoryId: 2, name: 'Google Tag Manager' },
    { categoryId: 2, name: 'Google Analytics' },
    { categoryId: 3, name: 'documentation' },
    { categoryId: 3, name: 'workflows' },
    { categoryId: 3, name: 'historical-reference' },
    { categoryId: 3, name: '2015' },
    { categoryId: 3, name: 'orientation-cdo' },
    { categoryId: 3, name: 'acb-migration' },
    { categoryId: 3, name: 'acb-review' },
    { categoryId: 3, name: 'houseclean-review' },
  ];

  // Seed all the labelCategories first using the dataLabelCategories array
  let categoryIndex = 0;
  for (const categoryName of dataLabelCategories) {
    await prisma.label_categories.upsert({
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
  let labelIndex = 0;
  for (const label of dataLabels) {
    await prisma.labels.upsert({
      where: { name: label.name },
      update: {},
      create: {
        categoryId: label.categoryId,
        name: `${label.name}`,
      },
    });
    labelIndex++;
  }

  const item1 = await prisma.trainingItem.upsert({
    where: { itemId: '1027244033' },
    update: {},
    create: {
      itemId: '1027244033',
      title: '2020 Process Improvements (IN PROGRESS)',
      excerpt:
        'Goals\n\nPriority List\nTask\nActionable\nCompleted Date\nOutcome\nNeed to have convo with POs on major, minor version numbers\n4 digits:\n1st digit = PO determines\n2nd = major\n3rd = minor\n4th = patch\nPOs, producers, and devs will talk about major releases.\nHow to organize Jira as we move to more, smaller applications and services',
      labels: {
        connect: [
          { name: 'acb-review' },
          { name: 'houseclean-review' },
          { name: 'Jira' }, // Assuming 'Jira' is a label under 'tools'
          { name: 'Project Management' }, // Assuming this is a label under 'advanced-skills'
          { name: 'Technical Management' }, // Assuming this is a label under 'advanced-skills'
        ],
      },
      key: '/spaces/DPKB',
      body: 'This is just a seed',
      url: 'https://confluence.com/wiki/spaces/DPKB/pages/1027244033',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const item2 = await prisma.trainingItem.upsert({
    where: { itemId: '1027244034' },
    update: {},
    create: {
      itemId: '1027244034',
      title: 'Digital Products ­ Critical First 5 Steps',
      excerpt:
        'Digital Products ­ Critical First 5 Steps\n1. Prioritization Meeting\nEach team member writes (In their opinion) the most important 5 project/milestones on sticky notes. Each project sticky note would contain:\nProject Name\nList of Benefits\nCost Estimate (IE: 1 resource for 3 days)\nOver the course of an afternoon, we all discuss',
      labels: {
        connect: [
          { name: 'documentation' },
          { name: 'workflows' },
          { name: 'historical-reference' },
          { name: '2015' },
          { name: 'orientation-cdo' },
          { name: 'acb-migration' },
          { name: 'acb-review' },
          { name: 'Jira' },
          { name: 'Confluence' },
          { name: 'Project Management' },
          { name: 'Technical Management' },
        ],
      },
      key: '/spaces/TD',
      body: 'This is just a seed.',
      url: 'https://confluence.com/wiki/spaces/TD/pages/1015900',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log('The training items are: ', item1, item2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
