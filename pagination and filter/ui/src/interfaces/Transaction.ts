import { RouteComponentProps } from "react-router";

export interface ITransactionData {
  promoCode: string;
  subTotal: string;
  siteDiscount:string;
  discountedAmount:string;
  grandTotal: string;
  transactionId: string;
  user: any,
  module: any,
  _id?: string;
  createdAt?:any;
}


export interface ITransactionState {
  totalRecords: number;
  currentPage: number;
  pageNeighbours: number;
  selectedTransaction:any;
  search: any;
  promoCode:any;
  status:any;
  showModal:boolean
  startDate: any;
  endDate: any;
  errors:
  {
    startDate:string;
    endDate:string
  }
}

export interface ITransactionModel {
    isLoading: boolean;
    transactionData: ITransactionData[];
    transactionInfo: ITransactionData;
    isError: boolean;
    totalRecords:number;
    currentPage:number;
    Url_Report:string
  }

export interface ITransactionProps extends RouteComponentProps{
  transactionReducer: ITransactionModel;
  getTransactions: (data:any) => void;
  redirectTo: (data:any) => void;
  getTransactionsReport:(data:any)=>void
}
