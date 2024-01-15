import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import consola from 'consola';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { BufferMemory } from 'langchain/memory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

export async function GET(): Promise<void> {
  /* Initialize the LLM to use to answer the question */
  const model = new ChatOpenAI({});
  /* Load in the files within the directory matching this glob pattern
  data/training/confluence/*.md.  We'll do the question answering over these
  files*/
  const loader = new DirectoryLoader('data/training/confluence', {
    '.json': (path) => new JSONLoader(path),
  });

  const dataTrainingItems = await loader.load();
  consola.log('The dataTrainingItems are', dataTrainingItems);
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  // const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore and initialize it as a retriever */
  const vectorStore = await HNSWLib.fromDocuments(
    dataTrainingItems,
    new OpenAIEmbeddings(),
  );
  const retriever = vectorStore.asRetriever();
  /* Initialize our BufferMemory store */
  const memory = new BufferMemory({
    memoryKey: 'chatHistory',
  });
}
