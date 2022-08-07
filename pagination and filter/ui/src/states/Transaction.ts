import { ITransactionModel } from "../interfaces";

export const TransactionInitialState: ITransactionModel = {
  isLoading: true,
  currentPage: 1,
  Url_Report:'',
  transactionData: [],
  transactionInfo:{
    promoCode: '',
    subTotal: '',
    siteDiscount:'',
    discountedAmount: '',
    grandTotal: '',
    transactionId: '',
    user: [],
    module: [],
  },
  isError: false,
  totalRecords:0,
};
