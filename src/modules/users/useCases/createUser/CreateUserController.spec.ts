import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create a User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to create a new User", async() => {
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new User with email exists", async() => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    expect(response.status).toBe(400)
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
