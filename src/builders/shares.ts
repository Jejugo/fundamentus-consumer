// eslint-disable all
export const createArrayOfShares = (data: any) =>
  Object.keys(data).map(item => ({
    share: item,
    ...data[item],
  }));
