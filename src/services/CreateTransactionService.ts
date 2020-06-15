import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Invalid transaction type');
    }

    const { total } = this.transactionsRepository.getBalance();

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    if (type === 'outcome' && total < value) {
      throw new Error(
        `It's not allowed to create an outcome transaction with a value greater than the total`,
      );
    }

    return transaction;
  }
}

export default CreateTransactionService;
