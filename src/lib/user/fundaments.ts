import { getData, setData } from '../../commons/request';

export const setUserFundaments = async (body, userId: string) => {
  console.log('body', body);
  console.log('userId', userId);

  // await setData('userFundaments', {}, userId),

  // return {
  //   status: 200,
  //   message: `Data updated successfully`,
  // };
};

export const getUserFundaments = async () => {
  return {
    status: 200,
    message: `Data updated successfully`,
  };
};
