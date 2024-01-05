import { Button } from 'components/Button/Button';
import { LP_GRID_ITEMS } from 'lp-items';
import { Metadata } from 'next';
import Link from 'next/link';

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
            <ul>
              {dataItems &&
                dataItems.map((article: TrainingItem, index: number) => (
                  <li key={article.url}>
                    <h6>{index}</h6>
                    <h3>
                      <Link href={article.url} target='_blank' rel='noreferrer'>
                        {article.title}
                      </Link>
                    </h3>
                    {article.labels &&
                      article.labels.map((label: string, idx: number) => (
                        <h6 className='label' index={idx}>
                          {label.name}
                        </h6>
                      ))}
                    <blockquote>{article.excerpt}</blockquote>
                    {/* {article.body && <Article>{article.body}</Article>} */}
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
