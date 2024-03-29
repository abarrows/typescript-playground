import { Metadata } from 'next';
import Link from 'next/link';

import Article from '@/components/Article/Article';
import serviceRouteHandler from '@/components/serviceRouteHandler';
import saveTrainingData, { TrainingItem } from '@/utilities/saveTrainingData';

interface LangChainItem {
  title: string;
  url: string;
  body: string;
  id: string;
  key: string;
  excerpt: string;
  labels: string[] | '';
}

export const metadata: Metadata = {
  title: 'LangChain Training Data',
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

// async function populateArticleBodyAndLabels(
//   item: TrainingItem,
//   itemContent: Content,
// ) {
//   item.body = itemContent.content.body.view.value;
//   item.labels = itemContent.metadata.labels.results;
// }

export default async function Page() {
  // Initial request to LangChain API using credentials to search using jql.
  const getItems = await serviceRouteHandler('api/langchain');
  const dataItems = getItems;
  saveTrainingData('gpt-recommendations', dataItems);
  return (
    <>
      <section className='bg-white dark:bg-gray-900'>
        <div className='container mx-auto'>
          <div className='mx-auto place-self-center'>
            <h1 className='mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white'>
              LangChain Articles List
            </h1>
            <div className='overflow-x-auto'>
              <table className='w-full whitespace-nowrap'>
                <thead>
                  <tr className='h-16 w-full text-sm leading-none text-gray-600'>
                    <th className='font-normal text-left pl-1'>Index</th>
                    <th className='font-normal text-left pl-1'>ID</th>
                    <th className='font-normal text-left pl-1'>Key</th>
                    <th className='font-normal text-left pl-4'>
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
                    <th className='font-normal text-left pl-12'>Body</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {dataItems &&
                    dataItems.map((item: TrainingItem, index: number) => (
                      <tr
                        className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-100 border-y border-gray-100'
                        key={`${index}-${item.id}-${item.key}`}
                      >
                        <td className='pl-4 cursor-pointer'>{index}</td>
                        <td className='pl-1'>{item.id}</td>
                        <td className='pl-1'>{item.key}</td>
                        <td className='pl-1'>
                          {item.title}
                          <br />
                          <br />
                          {item.excerpt && <Article>{item.excerpt}</Article>}
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
                          {item.labels &&
                            item.labels.map((label: string, idx: number) => (
                              <p key={idx}>{label.name}</p>
                            ))}
                        </td>
                        <td className='font-normal text-left pl-1'></td>
                        <td className='font-normal text-left pl-1'></td>
                        <td className='font-normal text-left pl-1'></td>
                        <td className='pl-1'>
                          {item.body && (
                            <Article>
                              {item.body.replace(/<(?!br\s*\/?)[^>]+>/gi, '')}
                            </Article>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
