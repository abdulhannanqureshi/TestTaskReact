import { RouteComponentProps } from "react-router";

export interface ITemplateState {
  name: string;
  subject: string;
  content: any;
  isEditable: boolean;
  id: string;
  editorState: any;
  errors: {
    name: string;
    subject: string;
    content: string;
  };
}

export interface ITemplateProps
  extends RouteComponentProps<{
    id: string;
  }> {
  templateReducer: ITemplateModal;
  addTemplate: (data: any) => void;
  updateTemplate: (data: any) => void;
  viewTemplate: (data: any) => void;
}

export interface ITemplateModal {
  isLoading: boolean;
  isError: boolean;
  templateData: any[];
  templateInfo: any;
}
