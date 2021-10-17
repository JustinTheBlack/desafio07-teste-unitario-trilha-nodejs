import { Statement } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { ICreateStatementDTO, OperationType } from "../createStatement/ICreateStatementDTO";

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}
  async execute({ amount, description, type, user_id, send_id }:ICreateStatementDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(!send_id) {
      throw new CreateStatementError.UserNotInformation();
    }

    const userSend = await this.usersRepository.findById(send_id);

    if(!userSend) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statementOperationTransfer = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description,
      send_id,
    });

    const statementOperationReceive = await this.statementsRepository.create({
      user_id: send_id,
      type: OperationType.RECEIVE,
      amount,
      description,
      send_id: user_id,
    });

    return statementOperationTransfer;

  };
}

export { TransferStatementUseCase };
