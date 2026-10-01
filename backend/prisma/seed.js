import { prisma } from "../src/lib/prisma.js";
import { balanceLines, customers, invoices, products, serviceJobs } from "../src/data/seedData.js";

async function main() {
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

  await prisma.customer.createMany({
    data: customers,
    skipDuplicates: true,
  });

  await prisma.invoice.createMany({
    data: invoices,
    skipDuplicates: true,
  });

  await prisma.serviceJob.createMany({
    data: serviceJobs,
    skipDuplicates: true,
  });

  await prisma.balanceLine.createMany({
    data: balanceLines.map((line, index) => ({
      id: `bal-${String(index + 1).padStart(3, "0")}`,
      ...line,
    })),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
