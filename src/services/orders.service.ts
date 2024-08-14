import { col, literal, Op } from 'sequelize';
import { Order } from '../models/orders.model';
import { Buying } from '../models/buyings.model';
import { Liquor } from '../models/liquors.model';
import { State } from '../models/states.model';

export const selectAllOrders = async (companyNumber: string, status: number | undefined, page: number) => {
  try {
    const LIMIT = 8;
    const offset = (page - 1) * LIMIT;

    const statusWhereCondition: { stateId?: number } = {};
    if (status) {
      statusWhereCondition.stateId = status;
    }

    const orders = await Order.findAndCountAll({
      attributes: [
        [literal('DATE(DATE_ADD(Order.created_at, INTERVAL 9 HOUR))'), 'createdAt'],
        [col('Buying->Liquor.img'), 'img'],
        [col('Buying.title'), 'title'],
        [col('Buying->Liquor.name'), 'liquorName'],
        [col('Buying.content'), 'content'],
        [col('State.status'), 'status'],
      ],
      include: [
        {
          model: Buying,
          attributes: [],
          include: [
            {
              model: Liquor,
              attributes: [],
            },
          ],
        },
        {
          model: State,
          attributes: [],
        },
      ],
      where: {
        ...statusWhereCondition,
        userCompanyNumber: companyNumber,
        createdAt: { [Op.gte]: literal('DATE_SUB(NOW(), INTERVAL 1 YEAR)') },
      },
      limit: LIMIT,
      offset: offset,
    });

    const ordersAndPagination = {
      orders: orders.rows,
      pagination: {
        currentPage: +page,
        totalPage: Math.ceil(orders.count / LIMIT),
      },
    };

    return ordersAndPagination;
  } catch (err) {
    throw new Error('공동구매 참여 목록 조회 실패');
  }
};
