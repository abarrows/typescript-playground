import { PrismaClient } from '@prisma/client';

// Assuming you have a PrismaClient instance
const prisma = new PrismaClient();

export default async function Page() {
  const trainingItems = await prisma.trainingItem.findMany();
  console.log(trainingItems);
  return <h1>Training Items</h1>;
}
