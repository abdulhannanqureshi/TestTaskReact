import corporateData from '../common/corporation.json';

import { CorporateModel } from '../models';

const addCorporate = async () => {
  const result = await CorporateModel.find();
  if (result.length === 0) {
    const data: any = await CorporateModel.insertMany(corporateData);
  }
};

export default { addCorporate };
