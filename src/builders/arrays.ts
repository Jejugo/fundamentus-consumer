import { IStockItem, IFundamentusStockItem } from 'lib/interfaces';

interface RandomObject<T> {
  [key: string]: T;
}

/**
 * Method to convert a regular list of objects into a object map given a key => [{ a: 1, b: 2}, { a: 3, b: 4}] => { a: { a: 1, b: 2 }}
 * @param {Array} arr Array of values that will be converted into an object
 * @param {String} key String that will define which key will be used as the object key
 */
export const convertArrayToObject = <
  T extends RandomObject<string | number> | IStockItem | IFundamentusStockItem,
>(
  arr: T[],
  key: string,
): RandomObject<IStockItem | IFundamentusStockItem> => {
  return arr.reduce(
    (acc, curr) => ({
      ...acc,
      // @ts-ignore
      [curr[key].toLowerCase()]: curr,
    }),
    {},
  );
};
