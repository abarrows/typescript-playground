import consola from 'consola';
import { Metadata } from 'next';
import Link from 'next/link';

import Article from '@/components/Article/Article';
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
        <div className='container mx-auto'>
          <div className='mx-auto place-self-center'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white'>
              Confluence Articles List
            </h1>
            <div className='overflow-x-auto'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='h-16 w-full text-sm leading-none text-gray-600'>
                    <th className='font-normal text-left pl-4'>Index</th>
                    <th className='font-normal text-left pl-12'>ID</th>
                    <th className='font-normal text-left pl-12'>Url</th>
                    <th className='font-normal text-left pl-12'>Title</th>
                    <th className='font-normal text-left pl-12'>
                      Original Labels
                    </th>
                    <th className='font-normal text-left pl-12'>AI Labels</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {normalizedJiraIssues &&
                    normalizedJiraIssues.map(
                      (item: TrainingItem, index: number) => (
                        <tr className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-y border-gray-100'>
                          <td className='pl-4 cursor-pointer'>{index}</td>
                          <td className='pl-12'>{item.id}</td>
                          <td className='pl-12'>
                            <Link
                              href={item.url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              {item.url}
                            </Link>
                          </td>
                          <td className='pl-12'>{item.title}</td>
                          <td className='pl-12'>
                            {item.labels &&
                              item.labels.map((label: string, idx: number) => (
                                <p key={idx}>{label.name}</p>
                              ))}
                          </td>
                          <td className='pl-12'>
                            {item.body && (
                              <Article>{JSON.stringify(item.body)}</Article>
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
