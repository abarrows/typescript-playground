import { PrismaClient } from '@prisma/client';

const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : global.prisma || new PrismaClient();

export default prisma;
