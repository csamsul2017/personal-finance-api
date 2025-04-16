const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapDBToModel } = require('../../utils');

class TransactionsService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async verifyTransactionOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM finance WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Transaction not found');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError(
        'You are not authorized to access this resource',
      );
    }
  }

  async verifyTransactionAccess(transactionId, userId) {
    try {
      await this.verifyTransactionOwner(transactionId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(
          transactionId,
          userId,
        );
      } catch {
        throw error;
      }
    }
  }

  async addTransaction({ type, amount, category, description, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO finance VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING ID',
      values: [
        id,
        type,
        amount,
        category,
        description,
        createdAt,
        updatedAt,
        owner,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('data failed to add');
    }

    await this._cacheService.delete(`transactions:${owner}`);
    return result.rows[0].id;
  }

  async getTransactions(owner) {
    try {
      const result = await this._cacheService.get(`notes:${owner}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT finance.* FROM finance
      LEFT JOIN collaborations ON collaborations.transaction_id = finance.id
      WHERE finance.owner = $1 OR collaborations.user_id = $1
      GROUP BY finance.id`,
        values: [owner],
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);

      // transaksi akan disimpan pada cache sebelum fungsi getTransactions dikembalikan
      await this._cacheService.set(
        `transactions:${owner}`,
        JSON.stringify(mappedResult),
      );

      return mappedResult;
    }
  }

  async getTransactionById(id) {
    const query = {
      text: `SELECT finance.*, users.username
      FROM finance
      LEFT JOIN users ON users.id = finance.owner
      WHERE finance.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('transaction not found');
    }

    return mapDBToModel(result.rows[0]);
  }

  async editTransactionById(id, { type, amount, category, description }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE finance SET type = $1, amount = $2, category = $3, description = $4, updated_at = $5 WHERE id = $6 RETURNING id',
      values: [type, amount, category, description, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('transaction failed to edit, id not found');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`transactions:${owner}`);
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

    const { owner } = result.rows[0];
    await this._cacheService.delete(`transactions:${owner}`);
  }
}

module.exports = TransactionsService;
