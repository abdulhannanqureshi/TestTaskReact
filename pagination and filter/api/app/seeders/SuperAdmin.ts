import { encryptPassword, generateSalt, rolesPermission } from '../common';

import { UserModel } from '../models';

const addSuperAdmin = async () => {
  const result = await UserModel.find({
    email: 'superadmin@coinifide.com',
    role: 'Superadmin',
    isDeleted: false,
  });
  if (result.length === 0) {
    const salt: string = generateSalt(10);
    const password: string = encryptPassword('Coinfied@123', salt);
    const data: object = {
      firstName: 'Super-admin',

      email: 'superadmin@coinifide.com',
      role: 'Superadmin',
      password,
      rolesPermission,
    };
    const userData: any = new UserModel(data);
    const result: any = await userData.save();
  }
};

export default { addSuperAdmin };
