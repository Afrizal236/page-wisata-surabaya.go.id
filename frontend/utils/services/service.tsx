import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import axiosConfig from 'utils/axios.config'
dayjs.extend(utc)
dayjs.extend(timezone)

export const getServices = async (page: number = 1, search: string = '', limit: number = 10) => {
  const getData = await axiosConfig(true)
    .get(`public/${process.env.SURABAYA_SLUG}/service?limit=${limit}&page=${page}&search=${search}`)
    .then((response) => {
      const { data } = response.data
      return data?.length
        ? data.map((item) => {
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            feature_image_url: item.imageUrl,
            // created_at: item.createdAt,
            created_at: item.createdAt ? dayjs.tz(dayjs(item.createdAt), 'Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ssZ') : '',
          }
        })
        : []
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return []
    })
  return getData
}
