

export type WithPagination<T = {}> = T & {
  page: string;
  pageSize: string;
  isTournament?: string;
};