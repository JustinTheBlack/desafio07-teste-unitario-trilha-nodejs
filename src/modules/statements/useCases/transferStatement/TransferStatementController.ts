import { Request, Response } from "express";
import { container } from "tsyringe";
import { OperationType } from "../createStatement/ICreateStatementDTO";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { send_id } = request.params;
    const { amount, description } = request.body;

    const type = OperationType.TRANSFER;

    const transferStatementUseCase = container.resolve(TransferStatementUseCase);

    const statement = await transferStatementUseCase.execute({ user_id, type, amount, description, send_id });

    return response.status(201).json(statement);
  }
}

export { TransferStatementController };
