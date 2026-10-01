import { invoiceToForm, invoiceTotal } from "../../frontend/src/utils/invoices.js";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import test from "node:test";

// Run only against a dedicated MySQL test database, never a production database.
const testUrl = process.env.MYSQL_TEST_DATABASE_URL;

test("MySQL: API CRUD, Unicode, long images, JSON and all resource reads", { skip: !testUrl }, async () => {
  process.env.DATABASE_URL = testUrl;
  const { prisma } = await import("../src/lib/prisma.js");
  const { createApp } = await import("../src/app.js");
  const server = createApp().listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const { hashPassword } = await import("../src/lib/auth.js");
  const username = `test-${randomUUID()}`;
  const password = randomUUID();
  await prisma.admin.create({ data: { username, passwordHash: await hashPassword(password) } });
  const denied = await fetch(`${origin}/api/customers`);
  assert.equal(denied.status, 401);
  const login = await fetch(`${origin}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json", "X-Meka-Request": "1" }, body: JSON.stringify({ username, password }) });
  assert.equal(login.status, 200);
  const cookie = login.headers.get("set-cookie").split(";")[0];
  const created = [];
  const request = async (path, method = "GET", body, status = 200) => {
    const response = await fetch(`${origin}/api${path}`, {
      method,
      headers: { "Content-Type": "application/json", "X-Meka-Request": "1", Cookie: cookie },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const result = await response.json();
    assert.equal(response.status, status, JSON.stringify(result));
    return result.data;
  };
  try {
    const image = `data:image/png;base64,${(await sharp({ create: { width: 20, height: 20, channels: 3, background: "red" } }).png().toBuffer()).toString("base64")}`;
    const product = await request("/products", "POST", {
      name: "İğdır Çelik 🏍️", category: "Yedek parça", brand: "Test",
      price: 100, stock: 2, minStock: 3, image,
    }, 201);
    created.push(["/products", product.id]);
    assert.match((await request(`/products/${product.id}`)).image, /^\/uploads\/.+\.webp$/);
    const publicResponse = await fetch(`${origin}/api/public/products`);
    const publicProduct = (await publicResponse.json()).data.find(p => p.id === product.id);
    assert.equal(publicProduct.image, product.image);
    assert.equal(publicProduct.price, undefined);
    const uploaded = await fetch(`${origin}${product.image}`);
    assert.equal(uploaded.status, 200);
    assert.equal(uploaded.headers.get("content-type"), "image/webp");
    assert.equal(product.name, "İğdır Çelik 🏍️");
    assert.equal((await request(`/products/${product.id}`, "PUT", { stock: 8 })).stock, 8);

    const notes = "Türkçe bakım notu 🛠️ ".repeat(500);
    const customer = await request("/customers", "POST", {
      name: "Çağrı Şen", phone: "05550000000", motorcycle: "Test",
      lastAction: "Bakım", status: "Aktif", date: "2026-09-07", notes,
    }, 201);
    created.push(["/customers", customer.id]);
    assert.equal(customer.notes, notes);
    assert.equal((await request(`/customers/${customer.id}`, "PUT", { notes: "Güncellendi" })).notes, "Güncellendi");

    const items = [{ description: "Yağ değişimi 🏍️", quantity: 2, price: 50 }];
    const invoice = await request("/invoices", "POST", {
      customer: "Çağrı Şen", description: notes, amount: 100, status: "Taslak",
      date: "2026-09-07", items,
    }, 201);
    created.push(["/invoices", invoice.id]);
    assert.deepEqual(invoice.items, items);
    const updated = await request(`/invoices/${invoice.id}`, "PUT", { items: [], discount: 10 });
    assert.deepEqual(updated.items, []);
    assert.equal(Number(updated.discount), 10);

    for (const path of ["/products", "/customers", "/invoices", "/invoices/summary", "/stock", "/stock/alerts", "/service/jobs", "/service/summary", "/dashboard/summary"]) {
      await request(path);
    }
    // Roll back a real multi-model transaction, including nullable JSON/default fields.
    const rollback = new Error("test rollback");
    await assert.rejects(prisma.$transaction(async (tx) => {
      const service = await tx.serviceJob.create({ data: {
        id: "mysql-integration-service", motorcycle: "Test", operation: notes,
        schedule: "Bugün", status: "Parça bekliyor", notes,
      } });
      assert.equal(service.notes, notes);
      await tx.balanceLine.create({ data: { id: "mysql-integration-balance", label: "İşçilik", amount: 100, type: "Gelir" } });
      const nullable = await tx.invoice.create({ data: {
        id: "mysql-integration-null", customer: "Test", description: "Test", amount: 0, status: "Taslak", date: "2026-09-07",
      } });
      assert.equal(nullable.items, null);
      assert.equal(Number(nullable.taxRate), 20);
      throw rollback;
    }), (error) => error === rollback);
    assert.equal(await prisma.serviceJob.findUnique({ where: { id: "mysql-integration-service" } }), null);
    const fractional = await request(`/invoices/${invoice.id}`, "PUT", { discount: "0.50", amount: "119.40" });
    assert.equal(Number(fractional.discount), 0.5);
    assert.equal(Number(fractional.amount), 119.4);
    const legacy = invoiceToForm({ customer: "Test", description: "Legacy", amount: "120", status: "Taslak", date: "2026-09-07", items: null, taxRate: "20", discount: "0" });
    assert.equal(invoiceTotal(legacy), 120);
    assert.equal(invoiceTotal({ items: [{ quantity: 1, unitPrice: "100" }], discount: "0.50", taxRate: "20" }), 119.4);
    const job = await request("/service/jobs", "POST", { motorcycle: "Test", operation: "Bakım", schedule: "2026-09-07", status: "Planlandı", labor: "0.50", notes }, 201);
    // POST convention differs from generic GET status.
    created.push(["/service/jobs", job.id]);
    assert.equal(Number(job.labor), 0.5);
    assert.equal((await request(`/service/jobs/${job.id}`, "PUT", { status: "Teslim hazır" })).status, "Teslim hazır");
    assert.ok((await request("/service/jobs")).some(row => row.id === job.id));
    const stockResponses = await Promise.all([1, 2].map(() => fetch(`${origin}/api/stock/movements`, {
      method: "POST", headers: { "Content-Type": "application/json", "X-Meka-Request": "1", Cookie: cookie },
      body: JSON.stringify({ productId: product.id, type: "out", quantity: 6 }),
    })));
    assert.deepEqual(stockResponses.map(r => r.status).sort(), [201, 409]);
    const move = (await stockResponses.find(r => r.status === 201).json()).data;
    assert.equal((await request(`/products/${product.id}`)).stock, 2);
    await request(`/stock/movements/${move.id}/reverse`, "POST");
    await request(`/stock/movements/${move.id}/reverse`, "POST", undefined, 409);
    assert.equal((await request(`/products/${product.id}`)).stock, 8);
    await prisma.stockMovement.deleteMany({ where: { productId: product.id } });
    const noCsrf = await fetch(`${origin}/api/products/${product.id}`, { method: "DELETE", headers: { Cookie: cookie } });
    assert.equal(noCsrf.status, 403);
    while (created.length) {
      const [path, id] = created[created.length - 1];
      await request(`${path}/${id}`, "DELETE");
      created.pop();
    }
    await request(`/products/${product.id}`, "GET", undefined, 404);
    await request("/auth/logout", "POST");
    await request("/customers", "GET", undefined, 401);
  } finally {
    for (const [path, id] of created.reverse()) await request(`${path}/${id}`, "DELETE");
    await new Promise((resolve) => server.close(resolve));
    await prisma.admin.delete({ where: { username } });
    await prisma.$disconnect();
  }
});
