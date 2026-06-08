import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import axiosConfig from 'utils/axios.config'
import schema from 'types/schemas'
dayjs.extend(utc)
dayjs.extend(timezone)

async function getCount(search: string, category: string) {
  return await axiosConfig(true)
    .get(
      `public/${process.env.SURABAYA_SLUG}/post/${
        category ? `${category}` : ''
      }/count?search=${search}`
    )
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return null
    })
}

export const getDetail = async (
  slug: string,
  category: string
): Promise<schema['schemas']['Article']> => {
  const getData: schema['schemas']['Article'] = await axiosConfig(true)
    .get(`public/${process.env.SURABAYA_SLUG}/post/${category || ''}/${slug || ''}`)
    .then((response) => {
      const { data } = response?.data
      return {
        id: data.id,
        title: data.title,
        feature_image_url: data.featureImageUrl,
        publish_date:
          data.publishDate && data.publishDate.Valid
            ? dayjs.tz(dayjs(data.publishDate.Time), 'Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ssZ')
            : '',
        slug: data.slug,
        view_count: data.viewsCount,
        details: data.postDetails?.length
          ? data.postDetails.map((detail) => {
              return {
                page: detail.page,
                content: detail.content,
              }
            })
          : [],
      }
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return null
    })
  return getData
}

export const getNews = async (
  page: number = 1,
  search: string = '',
  limit: number = 10,
  category: string = ''
) => {
  const getData = await axiosConfig(true)
    .get(
      `public/${process.env.SURABAYA_SLUG}/post/${
        category ? `${category}` : ''
      }?limit=${limit}&page=${page}&search=${search}&orderColumn=publish_date&orderBy=desc`
    )
    .then(async (response) => {
      const { data } = response.data
      return data?.length
        ? await Promise.all(
            data.map(async (item) => {
              const detail = await getDetail(item.slug, category)
              return {
                id: item.id,
                title: item.title,
                feature_image_url: item.featureImageUrl,
                publish_date:
                  item.publishDate && item.publishDate.Valid
                    ? dayjs
                        .tz(dayjs(item.publishDate.Time), 'Asia/Jakarta')
                        .format('YYYY-MM-DDTHH:mm:ssZ')
                    : '',
                slug: item.slug,
                view_count: item.viewsCount,
                details: item.postDetails?.length
                  ? item.postDetails.map((detail) => {
                      return {
                        page: detail.page,
                        content: detail?.content || '',
                      }
                    })
                  : [],
                content:
                  detail?.details && detail?.details.length ? detail?.details[0].content : '',
              }
            })
          )
        : []
    })
    .catch((err: any) => {
      console.log('Getting Error', err)
      return []
    })
  return { data: getData, count: await getCount(search, category) }
}
