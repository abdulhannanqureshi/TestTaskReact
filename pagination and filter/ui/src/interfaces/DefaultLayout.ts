import { RouteComponentProps } from 'react-router';
import { IProfileInfo, IProfileModal } from './Profile';

export interface IredirectPath {
  path: string;
}

export interface IDefaultLayoutProps extends RouteComponentProps {
  redirectTo: (data: IredirectPath) => void;
  profileInfo: () => void;
  profileInfoReducer?: IProfileModal;
}

export interface IDefaultLayoutState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userDetails: {};
  checkSubAdmin: [];
  updateNavigate: {};
}

export interface IDefaultHeaderProps extends RouteComponentProps {
  profileInfoReducer?: {
    isLoading: boolean;
    profileInfo: IProfileInfo;
  };
  onLogout: () => void;
  talentlms: (data: any) => void;
}

export interface IDefaultHeaderState {
  editAccess: any;
  getSubView: any;
  getSubEdit: any;
  getUniversityView: any;
  getUniversityEdit: any;
  getCorporateView: any;
  getCorporateEdit: any;
}
