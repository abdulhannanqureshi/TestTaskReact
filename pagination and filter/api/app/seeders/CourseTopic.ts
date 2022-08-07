import { CourseTopicModel } from '../models';
import { addTlmsCategories } from '../controllers/superadmin/talentlms';

const addCourseTopic = async () => {
    /* const topics = ['Accounting', 'Finance', 'Cybersecurity', 'Taxation', 'Smart Contracts – HyperLedger', 'Smart Contracts Solidity'];
    for(let x in topics) {
        const result = await CourseTopicModel.find({ topicName: topics[x] });
        if (result.length === 0) {
            const data: object = {
                topicName: topics[x],
            };
            const courseTopicData: any = new CourseTopicModel(data);
            const result: any = await courseTopicData.save();
        }
    } */
    const result = await CourseTopicModel.find();
    // console.log('result', result.length);
    if(result.length === 0) addTlmsCategories();
    
};

export default { addCourseTopic };
