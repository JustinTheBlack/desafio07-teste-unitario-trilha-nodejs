import { Statement } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO, OperationType } from "./ICreateStatementDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Use Case", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("should be able to create a new deposit Statement", async () => {
    const userCreate: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    }
    const { id } = await inMemoryUsersRepository.create(userCreate);

    const statement: ICreateStatementDTO = {
      user_id: id,
      amount: 100,
      description: "Salário",
      type: OperationType.DEPOSIT,
    }
    const newStatement = await createStatementUseCase.execute(statement);
    expect(newStatement).toHaveProperty("id");
    expect(newStatement.type).toBe("deposit");
  });

  it("should be able to create a new withdrow Statement", async () => {
    const userCreate: ICreateUserDTO = {
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    }
    const { id } = await inMemoryUsersRepository.create(userCreate);

    await createStatementUseCase.execute({
      user_id: id,
      amount: 100,
      description: "Salário",
      type: OperationType.DEPOSIT,
    });

    const statement: ICreateStatementDTO = {
      user_id: id,
      amount: 50,
      description: "Pagamento",
      type: OperationType.WITHDRAW,
    }
    const newStatement = await createStatementUseCase.execute(statement);
    expect(newStatement).toHaveProperty("id");
    expect(newStatement.type).toBe("withdraw");
  });

  it("should not be able to create a new deposit Statement an nonexistent user", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "id",
        amount: 100,
        description: "Salário",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new withdraw with insufficient Funds", async () => {
    expect(async () => {
      const userCreate: ICreateUserDTO = {
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      }
      const { id } = await inMemoryUsersRepository.create(userCreate);

      await createStatementUseCase.execute({
        user_id: id,
        amount: 100,
        description: "Salário",
        type: OperationType.DEPOSIT,
      });

      const statement: ICreateStatementDTO = {
        user_id: id,
        amount: 150,
        description: "Pagamento",
        type: OperationType.WITHDRAW,
      }
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
