import axiosConfig from 'utils/axios.config';

export const getDetail = async (id: number) => {
  const getData = await axiosConfig(true).get(`page-detail?id=${id}`)
  .then((v) => {
    return v.data;
  }).catch((err: any) => {
    console.log('Getting Error', err);
  });
  return getData;
};