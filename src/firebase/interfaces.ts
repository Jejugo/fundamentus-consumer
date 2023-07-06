export interface IFirebaseAddToArray {
  collection: string;
  id: string;
  itemKey: string;
  item: string;
}

export interface IFirebaseRemoveFromArray {
  collection: string;
  id: string;
  item: string;
}

export interface IFirebaseRemoveFieldFromObject {
  collection: string;
  id: string;
  field: string;
}

export interface IFirebaseGetAllItems {
  collection: string;
  id: string;
}

interface DocumentData {
  /** A mapping between a field and its value. */
  [field: string]: any;
}

export declare type Primitive = string | number | boolean | undefined | null;

type WithFieldValue<T> =
  | T
  | (T extends Primitive
      ? T
      : T extends any
      ? {
          [K in keyof T]: WithFieldValue<T[K]>;
        }
      : never);

export interface IFirebaseAddAllItems {
  collection: string;
  id: string;
  item: WithFieldValue<DocumentData>;
}

export interface IFirebaseGetSingleItem {
  collection: string;
  id: string;
}

export interface IFirebaseAddListAsObject {
  collection: string;
  id: string;
  list: any[];
  key?: string;
}

export interface IFirebaseAddListsAsObjectWithList {
  collection: string;
  id: string;
  list: IStatement[];
  key?: string;
}

export interface IFirebaseRemoveObjectKey {
  collection: string;
  id: string;
  item: string;
}

export interface IArrayToObject<T> {
  [key: string]: T;
}
