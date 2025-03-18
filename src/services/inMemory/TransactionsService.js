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

    const transaction = this._transactions.filter(transaction => transaction.id === id)[0];

    if (!transaction) {
      throw new Error('data failed to add');
    }

    return transaction;
  }

  getAllTransactions() {
    return this._transactions;
  }

  getTransactionById(id) {
    const transaction = this._transactions.filter(transaction => transaction.id === id)[0];

    if (!transaction) {
      throw new Error('transaction not found');
    }

    return transaction;
  }

  editTransactionById({ id, type, amount, category, description }) {
    const index = this._transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) {
      throw new Error('transaction failed to edit, id not found');
    }
    const updatedAt = new Date().toISOString();

    this._transactions[index] = {
      ...this._transactions[index],
      type,
      amount,
      category,
      description,
      updatedAt,
    };
  }

  deleteTransactionById(id) {
    const index = this._transactions.findIndex(transaction => transaction.id === id);

    if (index === -1) {
      throw new Error('transaction failed to delete, id not found');
    }

    this._transactions.splice(index, 1);
  }
}

module.exports = TransactionsService;
