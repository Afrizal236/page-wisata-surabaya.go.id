import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { getData } from 'utils/services/webdisplay';

export default async function news(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'GET') {
    res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST });
    return;
  };

  const { page, limit, target } = req.query;
  const parsePage = page ? parseInt(page as string) : 1;
  const parseLimit = limit ? parseInt(limit as string) : 15;
  const endpoint = target ? (target as string).replace(/[^0-9a-z]/gi, ' ').replace(/ +(?= )/g, '') : '';
  const isEndpoint = endpoint == 'infografis' || endpoint == 'podcasts' || endpoint == 'videos';
  if (!endpoint || !isEndpoint) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: ReasonPhrases.BAD_REQUEST });
    return;
  };
  const data = await getData(parsePage, endpoint, parseLimit > 30 ? 30 : parseLimit);
  res.status(StatusCodes.OK).json({ message: ReasonPhrases.OK, data: data ? data : [] });
};