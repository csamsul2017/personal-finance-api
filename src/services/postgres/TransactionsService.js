const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class TransactionsService {
  constructor() {
    this._pool = new Pool();
  }

  async addTransaction({ type, amount, category, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO finance VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING ID',
      values: [id, type, amount, category, description, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('data failed to add');
    }

    return result.rows[0].id;
  }

  async getTransactions() {
    const result = await this._pool.query('SELECT * FROM finance');
    return result.rows.map(mapDBToModel);
  }

  async getTransactionById(id) {
    const query = {
      text: 'SELECT * FROM finance WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('transaction not found');
    }

    return result.rows.map(mapDBToModel);
  }

  async editTransactionById({ id, type, amount, category, description }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE finance SET type = $1, amount = $2, category = $3, description = $4, updated_at = $5 WHERE id = $6 RETURNING id',
      values: [type, amount, category, description, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('transaction failed to edit, id not found');
    }
  }

  async deleteTransactionById(id) {
    const query = {
      text: 'DELETE FROM finance WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('transaction failed to delete, id not found');
    }
  }
}

module.exports = TransactionsService;
