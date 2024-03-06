import consola from 'consola';

import type { RecommendedItem } from '@/types/training-items';
import { database } from '@/utilities/prisma';

export default async function Article(item: RecommendedItem | null) {
  if (!item) {
    consola.warn('There was no item in the request');
  }
  const trainingItem = await database.trainingItem.findFirstOrThrow({
    where: { itemId: item?.itemId },
  });
  return (
    // Setup the markup for all key values of the training item
    <main>
      <h1>{trainingItem?.title}</h1>
      <section>{trainingItem?.body}</section>
      <aside>
        <p>{trainingItem?.url}</p>
        <p>{trainingItem?.key}</p>
        <p>{trainingItem?.updatedAt}</p>
        <p>{trainingItem?.createdAt}</p>
        <p>{trainingItem?.labels}</p>
        <p>{trainingItem?.proficiencies}</p>
        <p>{trainingItem?.tools}</p>
        <p>{trainingItem?.advancedSkills}</p>
      </aside>
    </main>
  );
}
