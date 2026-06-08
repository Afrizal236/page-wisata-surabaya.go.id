import { kebabCase } from 'lodash'
import axiosConfig from 'utils/axios.config'

export const getData = async (page: number = 1, target: string, limit: number = 10) => {
  if (!target) {
    return
  }

  const getData = await axiosConfig(false)
    .get(`${target}?per_page=${limit}&page=${page}`)
    .then((response) => {
      const { data } = response?.data
      return {
        ...response?.data,
        data: data.length
          ? data.map((item) => {
              return {
                id: item.id,
                title: item.title,
                feature_image_url: item.feature_image,
                publish_date: item.created_at,
                slug: kebabCase(item.title),
                view_count: item.viewed_count,
                content: item.content,
                content_type: item.content_type,
              }
            })
          : [],
      }
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return []
    })
  return getData
}

export const getDetail = async (id: number, target: string) => {
  const getData = await axiosConfig(false)
    .get(`${target}-detail?id=${id}`)
    .then(({ data }) => {
      return {
        id: data.id,
        title: data.title,
        feature_image_url: data.feature_image,
        publish_date: data.created_at,
        slug: kebabCase(data.title),
        view_count: data.viewed_count,
        content: data.content,
        content_type: data.content_type,
      }
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
    })
  return getData
}
