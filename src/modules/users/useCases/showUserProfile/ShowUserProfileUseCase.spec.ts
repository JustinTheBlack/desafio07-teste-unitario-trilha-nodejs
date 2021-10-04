import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able a show user profile", async () => {
    const userCreate: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    }
    const { id } = await createUserUseCase.execute(userCreate);
    const user = await showUserProfileUseCase.execute(id);

    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
  });

  it("should not be able a show user profile an nonexistent user  equal object error", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("54321");
    }).rejects.toEqual({"message": "User not found", "statusCode": 404});
  });

  it("should not be able a show user profile an nonexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("54321");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
