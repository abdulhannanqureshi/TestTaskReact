import universitiesData from '../common/universities.json';

import { UniversityModel } from '../models';

const addUniversities = async () => {
  const result = await UniversityModel.find();
  if (result.length === 0) {
    const data: any = await UniversityModel.insertMany(universitiesData);
  }
};

export default { addUniversities };
