import doNotSellData from '../common/doNotSell.json';

import { DoNotSellModel } from '../models';

const addDoNotSell = async () => {
  const result = await DoNotSellModel.find();
  if (result.length === 0) {
    const data: any = await DoNotSellModel.create(doNotSellData);
  }
};

export default { addDoNotSell };
