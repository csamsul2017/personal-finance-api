const { nanoid } = require('nanoid');

class TransactionsService {
  constructor() {
    this._transactions = [];
  }

  addTransaction({ type, amount, category, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newTransaction = { id, type, amount, category, description, createdAt, updatedAt };
    this._transactions.push(newTransaction);

    const isSuccess = this._transactions.some(transaction => transaction.id === id);

    if (!isSuccess) {
      throw new Error('data failed to add');
    }

    return id;
  }

  getAllTransactions() {
    return this._transactions;
  }
}

module.exports = TransactionsService;
