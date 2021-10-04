import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to Authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    }
    await createUserUseCase.execute(user);
    const token = await authenticateUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(token).toHaveProperty("token");
    expect(token.user).toHaveProperty("id");
    expect(token.user.name).toBe("teste")
  });

  it("should not be able to Authenticate an user with incorrect password to equal", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      }
      await createUserUseCase.execute(user);
      await authenticateUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to Authenticate an user with incorrect email to equal", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      }
      await createUserUseCase.execute(user);
      await authenticateUseCase.execute({
        email: "teste3@teste.com.br",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to Authenticate an user with incorrect to Instance error", async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: "email2@teste.com.br",
        password: "1231",
      });
    }).rejects.toMatchObject({"message": "Incorrect email or password", "statusCode": 401});
  });

  it("should not be able to Authenticate an user with incorrect to Instance error", async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: "email2@teste.com.br",
        password: "1231",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
