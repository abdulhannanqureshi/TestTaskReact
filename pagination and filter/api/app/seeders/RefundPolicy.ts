import refundPolicyData from '../common/refundPolicy.json';

import { RefundPolicyModel } from '../models';

const addRefundPolicy = async () => {
  const result = await RefundPolicyModel.find();
  if (result.length === 0) {
    const data: any = await RefundPolicyModel.create(refundPolicyData);
  }
};

export default { addRefundPolicy };
