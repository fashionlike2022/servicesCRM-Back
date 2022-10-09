/* eslint-disable no-param-reassign */
import { Schema, Document, Model, QueryOptions, PopulateOptions } from 'mongoose';

export interface QueryResult2 {
  results: Document[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface IOptions {
  sort?: string | any; // Sort order.
  select: string | any; // Fields to return (by default returns all fields)
  lean: boolean | any; // Should return plain javascript objects instead of Mongoose document object.
  // projectBy?: string;
  // populate?: string | PopulateOptions | PopulateOptions[];
  populate?: string;
  perPage: number;
  page: number;
  // projection: any | null;
  queryOptions: QueryOptions | null; // Query options passed to Mongoose's find() function
}

export const defaultOptions: IOptions = {
  lean: false,
  page: 1,
  perPage: 20,
  populate: undefined,
  queryOptions: {},
  select: '',
  sort: '',
};

const getFixedPage = (page: number | string): number => {
  return isNaN(+page) || +page < 1 ? 1 : +page;
};

export interface PaginationMeta {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  page: number;
  perPage: number;
  previousPage: number | null;
  totalDocuments: number;
  totalPages: number;
}
export interface Pagination<T> extends PaginationMeta {
  documents: T[];
}

export interface QueryResult extends PaginationMeta {
  documents: [];
}

export const createPaginationMeta = (totalDocuments: number, options: IOptions): PaginationMeta => {
  const { perPage, page } = options;
  const totalPages = Math.ceil(totalDocuments / perPage) || 1;
  let previousPage = null;
  let hasPreviousPage = false;
  if (page > 1 && page <= totalPages) {
    hasPreviousPage = true;
    previousPage = page - 1;
  }
  let nextPage = null;
  let hasNextPage = false;
  if (page < totalPages) {
    hasNextPage = true;
    nextPage = page + 1;
  }
  return {
    hasNextPage,
    hasPreviousPage,
    nextPage,
    page,
    perPage,
    previousPage,
    totalDocuments,
    totalPages,
  };
};

async function pagination<T>(this: Model<T>, filter: Record<string, any>, options: IOptions): Promise<Pagination<T>> {
  const mergedOptions: IOptions = {
    ...defaultOptions,
    ...options,
  };

  mergedOptions.page = getFixedPage(mergedOptions.page);
  mergedOptions.perPage = getFixedPage(mergedOptions.perPage);

  const { lean, page, perPage, populate, queryOptions, select, sort } = mergedOptions;

  const documentsQuery = this.find(filter, null, queryOptions).select(select).sort(sort).lean(lean);

  // if (populate !== undefined) {
  // documentsQuery.populate(populate as PopulateOptions | PopulateOptions[]);
  // }
  if (populate !== undefined) {
    populate.split(',').forEach((populateOption: any) => {
      documentsQuery.populate(
        populateOption
          .split('.')
          .reverse()
          .reduce((a: string, b: string) => ({ path: b, populate: a }))
      );
    });
  }

  const skip = (page - 1) * perPage;
  documentsQuery.skip(skip).limit(perPage);

  const [totalDocuments, documents] = await Promise.all([this.countDocuments(filter), documentsQuery]);

  return {
    documents: documents as unknown as T[],
    ...createPaginationMeta(totalDocuments, mergedOptions),
  };
}

const paginate = <T>(schema: Schema<T>): void => {
  schema.statics.paginate = pagination;
};

export default paginate;
