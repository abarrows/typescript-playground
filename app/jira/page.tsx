import consola from 'consola';
import { Search } from 'jira.js/out/version2/parameters';
import { Issue } from 'jira.js/out/version3/models';
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
  const getJiraResults: Search | void = serviceRouteHandler('api/jira');
  const dataJiraResults: unknown | void = await getJiraResults;
  consola.log(dataJiraResults);

  const normalizedJiraIssues = dataJiraResults.issues.map(
    (issue: Issue): TrainingItem => {
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
          <div className='mx-auto place-self-start'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white'>
              Jira Articles List
            </h1>
            <div className='overflow-x-auto'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='h-16 w-full text-sm leading-none text-gray-600'>
                    <th className='font-normal text-left pl-1'>Index</th>
                    <th className='font-normal text-left pl-1'>ID</th>
                    <th className='font-normal text-left pl-1'>Key</th>
                    <th className='font-normal text-left pl-1'>
                      Title and Excerpt
                    </th>
                    <th className='font-normal text-left pl-1'>Url</th>
                    <th className='font-normal text-left pl-1'>
                      Original Labels
                    </th>
                    <th className='font-normal text-left pl-1'>
                      Proficiencies
                    </th>
                    <th className='font-normal text-left pl-1'>Tools</th>
                    <th className='font-normal text-left pl-1'>
                      Advanced Skills
                    </th>
                    <th className='font-normal text-left pl-12'>Excerpt</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {normalizedJiraIssues &&
                    normalizedJiraIssues.map(
                      (item: TrainingItem, index: number) => (
                        <tr
                          className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-y border-gray-100'
                          key={`${index}-${item.id}-${item.key}`}
                        >
                          <td className='pl-1 cursor-pointer'>{index}</td>
                          <td className='pl-1'>{item.id}</td>
                          <td className='pl-1'>{item.key}</td>
                          <td className='pl-1'>
                            {item.title}
                            <br />
                            <br />
                            {item.body && (
                              <Article>{JSON.stringify(item.body)}</Article>
                            )}
                          </td>
                          <td className='pl-1'>
                            <Link
                              href={item.url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              {item.url}
                            </Link>
                          </td>
                          <td className='pl-1'>
                            {item.labels.map((label: string) => (
                              <h6 className='label' key={label}>
                                {label}
                              </h6>
                            ))}
                          </td>
                          <th className='font-normal text-left pl-1'></th>
                          <th className='font-normal text-left pl-1'></th>
                          <th className='font-normal text-left pl-1'></th>
                          {/* <td className='pl-7'>
                            {item.body && (
                              <Article>{JSON.stringify(item.body)}</Article>
                            )}
                          </td> */}
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
