export function getPaginationParams(query: Record<string, any>): { page: number; limit: number; skip: number } {
  const page: number = Math.max(1, parseInt(query.page) || 1);
  const limit: number = Math.max(1, parseInt(query.limit) || 10);
  const skip: number = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildMetaPagination(
  totalItems: number,
  page: number,
  limit: number
): { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } {
  const totalPages: number = Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
  };
}

