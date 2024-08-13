import { Request, Response } from 'express';
import { FilterType } from '../dto/buyings.dto';
import { selectBuyings } from '../services/buyings.service';
import { StatusCodes } from 'http-status-codes';
import HttpException from '../utils/httpExeption';

export const getBuygins = async (req: Request, res: Response) => {
  const filter = req.query.filter as FilterType;
  const page = parseInt(req.query.page as string);

  const buyingList = await selectBuyings(filter, page);
  if (!buyingList.buyings.length) {
    throw new HttpException(StatusCodes.NOT_FOUND, '조회할 공동구매 목록이 없습니다.');
  }

  return res.status(StatusCodes.OK).json(buyingList);
};
