/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    transaction_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  /*
      Menambahkan constraint UNIQUE, kombinasi dari kolom transaction_id dan user_id.
      Guna menghindari duplikasi data antara nilai keduanya.
    */
  pgm.addConstraint(
    'collaborations',
    'unique_transaction_id_and_user_id',
    'UNIQUE(transaction_id, user_id)',
  );

  // memberikan constraint foreign key pada kolom note_id dan user_id terhadap transactions.id dan users.id
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.transaction_id_finance.id',
    'FOREIGN KEY(transaction_id) REFERENCES finance(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'collaborations',
    'fk_collaborations.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};
