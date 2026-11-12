export const getPagination = ({ page = 1, limit = 10 } = {}) => ({
  page,
  limit,
  skip: (page - 1) * limit,
});

export const buildPaginationMeta = ({ total, page, limit }) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const buildSort = ({ sortBy = 'createdAt', order = 'desc' } = {}) => {
  const direction = order === 'asc' ? 1 : -1;
  return { [sortBy]: direction, _id: direction };
};