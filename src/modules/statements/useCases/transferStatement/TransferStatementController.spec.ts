import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Transfer Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to transfer a Statement", async () => {
    const responseTransfer = await request(app)
    .post("/api/v1/users")
    .send({
      name: "User Test",
      email: "teste@teste.com.br",
      password: "12345",
    });

    const responseSend = await request(app)
    .post("/api/v1/users")
    .send({
      name: "Paul Boone",
      email: "jo@juv.tg",
      password: "54321",
    });

    const { id: send_id } = responseSend.body;

    const responseToken = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "teste@teste.com.br",
      password: "12345",
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 500,
      description: "Deposit Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    const response = await request(app)
    .post(`/api/v1/statements/transfer/${send_id}`)
    .send({
      amount: 100,
      description: "Transfer Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
