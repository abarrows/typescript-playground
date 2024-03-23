import { Search } from 'jira.js/out/version2/parameters';
import { Metadata } from 'next';
import Link from 'next/link';

import Article from '@/components/Article/Article';
import serviceRouteHandler from '@/components/serviceRouteHandler';
import { Label, RecommendedItem } from '@/types/training-items';
import saveTrainingData from '@/utilities/saveTrainingData';
import saveTrainingDataInDatabase from '@/utilities/saveTrainingDataInDatabase';

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

export default async function Page() {
  const dataItems: Promise<Search> = await serviceRouteHandler('api/jira');
  console.log(typeof dataItems);
  // consola.info(`Retrieved ${dataItems?.length}`);

  // Save the Jira Articles to database
  saveTrainingDataInDatabase('jira', dataItems);
  saveTrainingData('jira', dataItems);
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
                  {dataItems?.map((item: RecommendedItem, index: number) => (
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
                        <Link href={item.url} target='_blank' rel='noreferrer'>
                          {item.url}
                        </Link>
                      </td>
                      <td className='pl-1'>
                        {item.labels.map((label: Label) => (
                          <h6 className='label' key={label.name}>
                            {label.name} {label.categoryName}
                          </h6>
                        ))}
                      </td>
                      <td className='font-normal text-left pl-1'></td>
                      <td className='font-normal text-left pl-1'></td>
                      <td className='font-normal text-left pl-1'></td>
                      {/* <td className='pl-7'>
                            {item.body && (
                              <Article>{JSON.stringify(item.body)}</Article>
                            )}
                          </td> */}
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
