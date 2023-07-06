import { getData } from '../../commons/request';

export const getStrategies = async () => {
  const { items, fromRedis } = await getData(
    'user:strategy',
    'userStrategy',
    true,
  );

  return {
    status: 200,
    message: `Data retrieved from ${
      fromRedis ? 'Redis' : 'Firebase'
    } collection userStrategy`,
    length: items.length,
    items,
  };
};