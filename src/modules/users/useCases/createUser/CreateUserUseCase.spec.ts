import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
describe("Create User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    }
    const newUser = await createUserUseCase.execute(user);
    expect(newUser).toHaveProperty("id");
  });

  it("should not be able to create with user already existis match object error", async () => {
    return expect(async () => {
      const user: ICreateUserDTO = {
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      };
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toEqual({"message": "User already exists", "statusCode": 400});
  });

  it("should not be able to create with user already existis", async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      }
      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });


})
