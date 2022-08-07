import privacyPolicyData from '../common/privacyPolicy.json';

import { PrivacyPolicyModel } from '../models';

const addPrivacyPolicy = async () => {
  const result = await PrivacyPolicyModel.find();
  if (result.length === 0) {
    const data: any = await PrivacyPolicyModel.create(privacyPolicyData);
  }
};

export default { addPrivacyPolicy };
