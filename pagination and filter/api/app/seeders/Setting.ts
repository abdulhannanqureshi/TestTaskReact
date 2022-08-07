import settingData from '../common/setting.json';

import { SettingModel } from '../models';

const addSetting = async () => {
  const result = await SettingModel.find();
  if (result.length === 0) {
    const data: any = await SettingModel.insertMany(settingData);
  }
};

export default { addSetting };
