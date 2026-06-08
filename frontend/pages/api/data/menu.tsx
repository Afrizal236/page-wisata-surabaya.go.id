import { NextApiRequest, NextApiResponse } from 'next'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { getMenus } from 'utils/services/menu'

export default async function menu(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST })
    return
  }
  const data = await getMenus()
  res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK, data: data ? data : [] })
}
