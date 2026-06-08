import axiosConfig from 'utils/axios.config';

export const getCarousel = async () => {
  const getData = await axiosConfig(true).get(`carousel`)
  .then((v) => {
    return v.data;
  }).catch((err: any) => {
    console.log('Getting Error', err);
  });
  return getData;
};