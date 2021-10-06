import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Get Statement Operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to get statement operatin deposit", async () => {
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

    const responseDeposit = await request(app)
    .post("/api/v1/statements/deposit")
    .send({
      amount: 100,
      description: "Deposit Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })

    await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })
    const { id } = responseDeposit.body;
    const response = await request(app)
    .get(`/api/v1/statements/${id}`)
    .set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe('deposit');
  });

  it("should be able to get statement operatin withdraw", async () => {
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

    const responseWithdraw = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })
    const { id } = responseWithdraw.body;
    const response = await request(app)
    .get(`/api/v1/statements/${id}`)
    .set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.body).toHaveProperty("id");
    expect(response.body.type).toBe('withdraw');
  });

  it("should not be able to get statement operatin withdraw with id incorrect", async () => {
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

    const responseWithdraw = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })
    const { id } = responseWithdraw.body;
    const response = await request(app)
    .get(`/api/v1/statements/a0b21b6e-e049-4dde-ac0b-718357fac4d7`)
    .set({
      Authorization: `Bearer ${token}`,
    })
    expect(response.status).toBe(404);
    expect(response.error).toHaveProperty("text");
  });

  it("should not be able to get statement operatin withdraw with token incorrect", async () => {
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

    const responseWithdraw = await request(app)
    .post("/api/v1/statements/withdraw")
    .send({
      amount: 50,
      description: "Withdraw Test",
    })
    .set({
      Authorization: `Bearer ${token}`,
    })
    const { id } = responseWithdraw.body;
    const response = await request(app)
    .get(`/api/v1/statements/${id}`)
    .set({
      Authorization: `Bearer ${token}u`,
    })
    expect(response.status).toBe(401);
    expect(response.error).toHaveProperty("text");
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
