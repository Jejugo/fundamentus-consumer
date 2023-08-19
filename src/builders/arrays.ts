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
      [curr[key].toLowerCase()]: curr,
    }),
    {},
  );
};

/**
 * Method to convert a object of objects to objects of lists => { abev: { 0: { status: checked, statements: bla }, 1: { status: checked, statements: bla }}} => { abev: [{ status: checked}, {...}]}
 * @param obj
 * @returns
 */
export const convertObjectKeysToList = <T extends RandomObject<T>>(obj: T) =>
  Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [key]: Object.values(obj[key]).map((item: any) => item),
    };
  }, {});

export const uniqueArray = array =>
  array.filter(
    (item, index, self) =>
      index === self.findIndex(obj => obj.name === item.name),
  );
