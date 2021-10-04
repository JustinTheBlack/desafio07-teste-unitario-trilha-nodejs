import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to get balance", async () => {
    const { id } = await inMemoryUsersRepository.create({
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    });

    await inMemoryStatementsRepository.create({
      user_id: id,
      amount: 100,
      description: "Salário",
      type: OperationType.DEPOSIT,
    });

    await inMemoryStatementsRepository.create({
      user_id: id,
      amount: 50,
      description: "Salário",
      type: OperationType.WITHDRAW,
    });
    const { statement, balance } = await getBalanceUseCase.execute({ user_id: id });

    expect(statement.length).toBe(2);
    expect(balance).toBe(50);
  });

  it("should not be able to get balance an nonexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "id" });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
