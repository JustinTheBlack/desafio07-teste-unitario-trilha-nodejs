import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to create a new Statement", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "12345",
    });
    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    expect(response.status).toBe(201);
  });

  it("should be able to create a new Statement", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "12345",
    });
    const { token } = responseToken.body;

    await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    const response = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new Statement with incorrect token", async () => {
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });
    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "12345",
    });
    const { token } = responseToken.body;

    const response = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit Test",
    })
    .set({
      Authorization: `Bearer ${token}C`,
    });

    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
