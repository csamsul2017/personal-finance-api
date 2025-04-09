const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(transactionId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, transactionId, userId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaboration failed to add');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(transactionId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE transaction_id = $1 AND user_id = $2 RETURNING id',
      values: [transactionId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaboration failed to delete');
    }
  }

  async verifyCollaborator(transactionId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE transaction_id = $1 AND user_id = $2',
      values: [transactionId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Collaboration failed to verify');
    }
  }
}

module.exports = CollaborationsService;
