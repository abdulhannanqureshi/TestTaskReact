import { IResponseHandlerModel } from "../../interfaces/ResponseHandlerModel";

export class SuccessHandlerHelper {
  rawData: any;
  data: IResponseHandlerModel = {
    code: 200,
    isError: false,
    timestamp: Date.now(),
    error: undefined,
    messages: [],
  };

  constructor(data: any) {
    this.rawData = data;
    this.setSucccess();
  }

  setSucccess = () => {
    const messages = [];

    for (let i in this.rawData) {
      if (typeof this.rawData[i] === "string") {
        messages.push(this.rawData[i]);
      }
    }
    this.data.data = this.rawData;
    this.data.messages = messages;
  };
}
