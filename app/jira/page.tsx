import { Button } from 'components/Button/Button';
import consola from 'consola';
import { env } from 'env.mjs';
import { LP_GRID_ITEMS } from 'lp-items';
import { Metadata } from 'next';
import Link from 'next/link';

import serviceRouteHandler from '@/components/serviceRouteHandler';
import saveArticles from '@/utilities/saveArticles';

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
  excerpt: string;
}

const generateIssueUrl = (issueKey: JiraIssue.key) => {
  return `https://${env.JIRA_DOMAIN}.atlassian.net/browse/${issueKey}`;
};

export default async function Page() {
  const getJiraResults: unknown | void =
    // await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/jira`);
    serviceRouteHandler('api/jira');
  const dataJiraResults: unknown | void = await getJiraResults;
  consola.log(dataJiraResults);

  // Save the Jira Articles to files
  saveArticles('jira', dataJiraResults.issues);

  return (
    <>
      <section className='bg-white dark:bg-gray-900'>
        <div className='mx-auto grid max-w-screen-xl px-4 py-8 text-center lg:py-16'>
          <div className='mx-auto place-self-center'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white'>
              Jira Articles List
            </h1>
            <ul>
              {dataJiraResults.issues.map((issue: JiraIssue) => (
                <li key={issue.id}>
                  <h3>
                    <Link
                      href={generateIssueUrl(issue.key)}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {issue.fields.summary}
                    </Link>
                  </h3>
                  <p>{JSON.stringify(issue.fields.description)}</p>
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
