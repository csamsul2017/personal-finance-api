/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  type,
  amount,
  category,
  description,
  created_at,
  updated_at,
  owner,
  username,
}) => ({
  id,
  type,
  amount,
  category,
  description,
  createdAt: created_at,
  updatedAt: updated_at,
  owner,
  username,
});
/* eslint-enable camelcase */
module.exports = { mapDBToModel };
