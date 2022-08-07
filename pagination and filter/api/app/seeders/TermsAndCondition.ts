import termsAndConditionData from '../common/termsAndCondition.json';

import { TermsAndConditionModel } from '../models';

const addTermsAndCondition = async () => {
  const result = await TermsAndConditionModel.find();
  if (result.length === 0) {
    const data: any = await TermsAndConditionModel.create(
      termsAndConditionData
    );
  }
};

export default { addTermsAndCondition };
