import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma.js";
const money = new Set(["price", "amount", "discount", "taxRate", "labor"]);
const normalize = (key, value) => value === null ? null : money.has(key) ? Number(value) : value instanceof Date ? value.toISOString() : value;
try {
  for (const table of ["products", "customers", "invoices", "service_jobs", "balance_lines"]) {
    const before = await prisma.$queryRawUnsafe(`SELECT * FROM meka_before_verify.${table} ORDER BY id`);
    const after = await prisma.$queryRawUnsafe(`SELECT * FROM meka.${table} ORDER BY id`);
    assert.equal(after.length, before.length, `${table}: record count mismatch`);
    before.forEach((row, index) => {
      for (const key of Object.keys(row)) assert.deepEqual(normalize(key, after[index][key]), normalize(key, row[key]), `${table}.${key}: value changed`);
    });
    console.log(`${table}: ${before.length} records, every original field preserved`);
  }
} finally { await prisma.$disconnect(); }
