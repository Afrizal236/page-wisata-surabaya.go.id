import axiosConfig from 'utils/axios.config';

export const getAgenda = async (
  page: number = 1,
  limit: number = 10,
) => {
  const getData = await axiosConfig(true).get(`agenda?per_page=${limit}&page=${page}`)
    .then((v) => {
      return v.data;
    }).catch((err: any) => {
      console.log('Getting Error', err);
    });
  return getData;
};