import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database";

let connection: Connection;

describe("Show User Profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  it("should be able to show to user profile ", async () => {
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
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}`,
    })

    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to show to user profile with canot token ", async () => {
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
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer `,
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("JWT invalid token!");
  });

  it("should not be able to show to user profile with incorrect token ", async () => {
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
    .get("/api/v1/profile")
    .set({
      Authorization: `Bearer ${token}g`,
    })
    expect(response.status).toBe(401);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
});
