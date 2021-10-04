import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able a get statement operation", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      name: "teste",
      email: "teste@teste.com.br",
      password: "12345",
    });

    const { id: statement_id } = await inMemoryStatementsRepository.create({
      user_id,
      amount: 100,
      description: "Salário",
      type: OperationType.DEPOSIT,
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    });

    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe("deposit");
  });

  it("should not be able a get statement operation an nonexistent user", async () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      });

      const { id: statement_id } = await inMemoryStatementsRepository.create({
        user_id,
        amount: 100,
        description: "Salário",
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able a get statement operation an nonexistent statement_id", async () => {
    expect(async () => {
      const { id: user_id } = await inMemoryUsersRepository.create({
        name: "teste",
        email: "teste@teste.com.br",
        password: "12345",
      });

      await inMemoryStatementsRepository.create({
        user_id,
        amount: 100,
        description: "Salário",
        type: OperationType.DEPOSIT,
      });

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
