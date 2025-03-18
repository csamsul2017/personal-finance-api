const { nanoid } = require('nanoid');
const transactions = require('./transactions');

const postTransactionHandler = (request, h) => {
  const { type, amount, category, description } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newTransaction = { id, type, amount, category, description, createdAt, updatedAt };
  transactions.push(newTransaction);

  const isSuccess = transactions.some(transaction => transaction.id === id);

  if (!isSuccess) {
    return h
      .response({
        status: 'fail',
        message: 'data failed to add',
      })
      .code(400);
  }

  return h
    .response({
      status: 'success',
      data: newTransaction,
    })
    .code(201);
};

const getAllTransactionsHandler = () => ({
  status: 'success',
  data: {
    transactions,
  },
});

const getTransactionByIdHandler = (request, h) => {
  const { id } = request.params;
  const result = transactions.find(transaction => transaction.id === id);

  console.log(result);

  if (result === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'transaction not found',
      })
      .code(404);
  }

  return h
    .response({
      status: 'success',
      data: {
        result,
      },
    })
    .code(200);
};

const putTransactionByIdHandler = (request, h) => {
  const { type, amount, category, description } = request.payload;
  const { id } = request.params;
  const updatedAt = new Date().toISOString();
  const index = transactions.findIndex(transaction => transaction.id === id);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'transaction failed to update, id not found',
      })
      .code(404);
  }

  transactions[index] = {
    ...transactions[index],
    type,
    amount,
    category,
    description,
    updatedAt,
  };

  return h
    .response({
      status: 'success',
      message: 'transaction successfully updated',
    })
    .code(200);
};

const deleteTransactionByIdHandler = (request, h) => {
  const { id } = request.params;
  const index = transactions.findIndex(transaction => transaction.id === id);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'transaction failed to delete, id not found',
      })
      .code(404);
  }

  transactions.splice(index, 1);

  return h
    .response({
      status: 'success',
      message: 'transaction successfully deleted',
    })
    .code(200);
};

module.exports = { postTransactionHandler, getAllTransactionsHandler, getTransactionByIdHandler, putTransactionByIdHandler, deleteTransactionByIdHandler };
