import { Metadata } from 'next';
import Link from 'next/link';

import Article from '@/components/Article/Article';
import serviceRouteHandler from '@/components/serviceRouteHandler';
import saveTrainingData, { TrainingItem } from '@/utilities/saveTrainingData';

interface ConfluenceArticle {
  title: string;
  url: string;
  body: string;
  id: string;
  key: string;
  excerpt: string;
  labels: string[] | '';
}

export const metadata: Metadata = {
  title: 'Confluence Article List',
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
  // Initial request to confluence API using credentials to search using jql.
  const getItems = await serviceRouteHandler('api/confluence');
  const dataItems = getItems.populatedItems;
  saveTrainingData('confluence', dataItems);
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
                  {dataItems &&
                    dataItems.map((item: TrainingItem, index: number) => (
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
                          {item.body && <Article>{item.body}</Article>}
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
