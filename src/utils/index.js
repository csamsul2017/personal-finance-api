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
}) => ({
  id,
  type,
  amount,
  category,
  description,
  createdAt: created_at,
  updatedAt: updated_at,
  owner,
});
/* eslint-enable camelcase */
module.exports = { mapDBToModel };
