import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getAgenda } from 'utils/services/agenda';

export default async function pers(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST });
    return;
  };
  const { page } = req.query;
  const parsePage = page ? parseInt(page as string) : 1;
  const data = await getAgenda(parsePage, 15);
  res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK, data: data ? data : [] });
};