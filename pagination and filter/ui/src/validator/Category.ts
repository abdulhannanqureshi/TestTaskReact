import Validator from 'js-object-validation';
import { message } from '../app/common';

export const categoryValidator = (data: any) => {
    const validations = {
      title: {
        required: true,
      },
      subTitle: {
        required: true,
      },
      decscrion: {
        required: true,
        minlength: 20,
      },
      topicName: {
        required: true,
      },
      media: {
        required: true,
        url: true,
      },
      description: {
        required: true,
      },
      bodySection1: {
        required: true,
        minlength: 20,
      },
      bodySection2: {
        required: true,
        minlength: 20,
      },            
      bodySection3: {
        required: true,
        minlength: 20,
      },                              
      bodySection4: {
        required: true,
        minlength: 20,
      },  
      certificateImage:
      {
        required:true
      }                            
    };
    // Error messages
    const messages = {
      title: {
        required: message.Required.replace(':item', 'Title'),
      },
      subTitle: {
        required: message.Required.replace(':item', 'Sub title'),
      },
      decscrion: {
        required: message.Required.replace(':item', 'Description'),
        minlength: message.MinLengthDecscription
      },
      topicName: {
        required: message.Required.replace(':item', 'Topic name'),
      },
      media:{
        required: message.Required.replace(':item', 'Media'),
        url: message.RequiredCourseMediaUrl
      },
      bodySection1:{
        required: message.Required.replace(':item', 'Section 1'),
        minlength: message.MinLength.replace(':item', 'Section 1')
      },
      bodySection2:{
        required: message.Required.replace(':item', 'Section 2'),
        minlength: message.MinLength.replace(':item', 'Section 2')
      },     
      bodySection3:{
        required: message.Required.replace(':item', 'Section 3'),
        minlength: message.MinLength.replace(':item', 'Section 3')
      },
      bodySection4:{
        required: message.Required.replace(':item', 'Section 4'),
        minlength: message.MinLength.replace(':item', 'Section 4')
      },
      certificateImage:
      {
        required: message.Required.replace(':item', 'Certificate Image'),
      }                        
    };
  
    const { isValid, errors } = Validator(data, validations, messages);
    return {
      isValid,
      errors,
    };
  };
  