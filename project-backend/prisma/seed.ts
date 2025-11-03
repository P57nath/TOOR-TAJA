// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   const [seller, buyer] = await Promise.all([
//     prisma.user.upsert({
//       where: { email: 'seller@toor-taja.com' },
//       update: {},
//       create: { email: 'seller@toor-taja.com', name: 'Default Seller', role: 'seller' }
//     }),
//     prisma.user.upsert({
//       where: { email: 'buyer@toor-taja.com' },
//       update: {},
//       create: { email: 'buyer@toor-taja.com', name: 'Default Buyer', role: 'buyer' }
//     }),
//   ]);

//   const fruits = await prisma.category.upsert({
//     where: { name: 'Fruits' }, update: {}, create: { name: 'Fruits' }
//   });

//   await prisma.product.create({
//     data: {
//       name: 'Banana',
//       price: 1.99,
//       stock: 120,
//       categoryId: fruits.id,
//       sellerId: seller.id,
//       rating: 4.6,
//       available: true,
//     } as any,
//   });
// }
// main().finally(() => prisma.$disconnect());
