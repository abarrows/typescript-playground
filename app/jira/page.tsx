import { Button } from 'components/Button/Button';
import consola from 'consola';
import { LP_GRID_ITEMS } from 'lp-items';
import { Metadata } from 'next';
import Link from 'next/link';

import serviceRouteHandler from '@/components/serviceRouteHandler';
import jiraDescriptionToMarkdown from '@/utilities/jiraDescriptionToMarkdown';
import saveTrainingData, { TrainingItem } from '@/utilities/saveTrainingData';

export const metadata: Metadata = {
  title: 'Jira Issues List',
  twitter: {
    card: 'summary_large_image',
  },
  openGraph: {
    url: 'https://next-enterprise.vercel.app/',
    images: [
      {
        width: 1200,
        height: 630,
        url: 'https://raw.githubusercontent.com/Blazity/next-enterprise/main/project-logo.png',
      },
    ],
  },
};

interface JiraIssue {
  title: string;
  url: string;
  body: string;
  id: string;
  key: string;
  excerpt: string;
}

export default async function Page() {
  const getJiraResults: unknown | void = serviceRouteHandler('api/jira');
  const dataJiraResults: unknown | void = await getJiraResults;
  consola.log(dataJiraResults);

  const normalizedJiraIssues = dataJiraResults.issues.map(
    (issue: JiraIssue): TrainingItem => {
      // Push each issue with only the selected fields into the
      // normalizedJiraResults array.

      // Use the function
      const markdownDescription = issue.fields.description
        ? jiraDescriptionToMarkdown(issue.fields.description)
        : '';
      return {
        id: issue.id,
        key: issue.key,
        url: `${process.env.JIRA_DOMAIN}/browse/${issue.key}`,
        title: issue.fields.summary,
        body: markdownDescription,
        excerpt: issue.fields.summary,
        labels: issue.fields.labels,
      };
    },
  );
  consola.log(normalizedJiraIssues);
  // Iterate through dataJiraResults and for each issue, use the following field
  // values to create a new object:
  // issue.id
  // issue.key
  // issue.fields.summary
  // issue.fields.description

  // Save the Jira Articles to files
  saveTrainingData('jira', normalizedJiraIssues);

  return (
    <>
      <section className='bg-white dark:bg-gray-900'>
        <div className='mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16'>
          <div className='mx-auto place-self-center'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white'>
              Jira Articles List
            </h1>
            <ul>
              {normalizedJiraIssues.map((issue: TrainingItem) => (
                <li key={issue.id}>
                  <h3>
                    <Link
                      href={`${process.env.JIRA_DOMAIN}/browse/${issue.key}`}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {issue.title}
                    </Link>
                  </h3>
                  {issue.labels.map((label: string) => (
                    <h6 className='label' key={label}>
                      {label}
                    </h6>
                  ))}
                  <p>{JSON.stringify(issue.body)}</p>
                </li>
              ))}
            </ul>
            <Button
              href='https://github.com/Blazity/next-enterprise'
              className='mr-3'
            >
              Get started
            </Button>
            <Button
              href='https://vercel.com/new/git/external?repository-url=https://github.com/Blazity/next-enterprise'
              intent='secondary'
            >
              Deploy Now
            </Button>
          </div>
        </div>
      </section>
      <section className='bg-white dark:bg-gray-900'>
        <div className='mx-auto max-w-screen-xl px-4 py-8 sm:py-16 lg:px-6'>
          <div className='justify-center space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3'>
            {LP_GRID_ITEMS.map((singleItem) => (
              <div
                key={singleItem.title}
                className='flex flex-col items-center justify-center text-center'
              >
                <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 p-1.5 text-blue-700 lg:h-12 lg:w-12 dark:bg-primary-900'>
                  {singleItem.icon}
                </div>
                <h3 className='mb-2 text-xl font-bold dark:text-white'>
                  {singleItem.title}
                </h3>
                <p className='text-gray-500 dark:text-gray-400'>
                  {singleItem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
