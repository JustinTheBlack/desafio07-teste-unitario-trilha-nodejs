export interface ICreateStatementDTO {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  send_id?: string;
}

export enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
  RECEIVE = 'receive'
}
