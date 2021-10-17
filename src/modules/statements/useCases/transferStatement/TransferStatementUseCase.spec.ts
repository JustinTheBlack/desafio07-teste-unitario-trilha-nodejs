import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO, OperationType } from "../createStatement/ICreateStatementDTO";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let transferStatementUseCase: TransferStatementUseCase;
describe("Transfer Statement Use Case", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    transferStatementUseCase = new TransferStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to create a transfer", async () => {
    const userTransfer: ICreateUserDTO = {
      name: "Carrie Patterson",
      email: "falnuju@rirobho.bb",
      password: "12345",
    }
    const { id: user_id } = await inMemoryUsersRepository.create(userTransfer);

    const userReceive: ICreateUserDTO = {
      name: "Catherine Lopez",
      email: "nuvtu@mauf.nl",
      password: "54321",
    }
    const { id: send_id } = await inMemoryUsersRepository.create(userTransfer);

    await inMemoryStatementsRepository.create({
      user_id,
      amount: 500,
      description: "Salário",
      type: OperationType.DEPOSIT,
    });

    const transfer: ICreateStatementDTO = {
      user_id,
      amount: 100,
      description: "Transferência test",
      type: OperationType.TRANSFER,
      send_id,
    }

    const newStatement = await transferStatementUseCase.execute(transfer);
    expect(newStatement).toHaveProperty("id");
    expect(newStatement.type).toBe("transfer");
  });
});
