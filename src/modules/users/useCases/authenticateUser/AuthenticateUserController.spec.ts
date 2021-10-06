import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Authenticate User", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to create a new Autheticate", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "12345",
    });
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("id");
  });

  it("should not be able to create a new Autheticate with incorrect email", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste2@teste.com.br",
      password: "12345",
    });
    expect(response.status).toBe(401)
  });

  it("should not be able to create a new Autheticate with incorrect password", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const response = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "InconrrectPassword",
    });
    expect(response.status).toBe(401)
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
