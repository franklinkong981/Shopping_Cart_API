process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../database/fakeDb");

let popsicle;
beforeEach(function() {
  popsicle = {name: "Popsicle", price: 2.50};
  items.push(popsicle);
});

afterEach(function() {
  //make sure this mutates, not redefines, "cats"
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all shopping list items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({items: [popsicle]});
  });
});

describe("GET /items/:name", () => {
  test("Get shopping list item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({item: popsicle});
  });
  test("Responds with 404 for invalid shopping list item name", async () => {
    const res = await request(app).get(`/items/notapopsicle`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Adding a new item to the shopping list", async () => {
    const res = await request(app).post("/items").send({ name: "Candy", price: 1.00 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({added: {name: "Candy", price: 1.00}});
  });
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({price: 1.00});
    expect(res.statusCode).toBe(400);
  });
  test("Responds with 400 if price is missing", async () => {
    const res = await request(app).post("/items").send({name: "Candy"});
    expect(res.statusCode).toBe(400);
  });
});

describe("PATCH /items/:name", () => {
  test("Updating a shopping list item's name", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({name: "Ice Cream"});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updatedItem: {name: "Ice Cream", price: 2.50}});
  });
  test("Updating a shopping list item's price", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({price: 3.50});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updatedItem: {name: "Popsicle", price: 3.50}});
  });
  test("Updating both a shopping list item's name and price", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({name: "Ice Cream", price: 3.50});
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({updatedItem: {name: "Ice Cream", price: 3.50}});
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/cats/notapopsicle`).send({name: "Ice Cream"});
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deleting a shopping list item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({message: "Deleted"});
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/notapopsicle`);
    expect(res.statusCode).toBe(404);
  });
});