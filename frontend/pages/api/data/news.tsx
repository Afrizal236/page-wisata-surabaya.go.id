import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { getNews } from 'utils/services/news'

export default async function news(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST })
    return
  }

  const { page, category, search } = req.query
  const validateSearch = search
    ? (search as string).replace(/[^0-9a-z]/gi, ' ').replace(/ +(?= )/g, '')
    : ''
  const parsePage = page ? parseInt(page as string) : 1
  const result = await getNews(parsePage, validateSearch, 15, category as string)
  res
    .status(StatusCodes.OK)
    .json({ message: ReasonPhrases.OK, data: result?.data || [], count: result?.count || 0 })
}
