import { sortArrayAlphabetically } from '../../builders/arrays';
import { getDataById } from '../../commons/request';

export const getStrategies = async (userId: string) => {
  const { items, fromRedis } = await getDataById(
    'user:strategy',
    'userStrategy',
    userId,
    true,
  );

  return {
    status: 200,
    message: `Data retrieved from ${
      fromRedis ? 'Redis' : 'Firebase'
    } collection userStrategy`,
    length: items.length,
    items: Object.keys(items).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: sortArrayAlphabetically(items[curr], 'statement'),
      };
    }, {}),
  };
};
