import { createLogic } from "redux-logic";
import { toast } from "react-toastify";
import { ApiHelper } from "../helper/ApiHelper";
import { ApiRoutes, AppRoutes } from "../config";
import {
  showLoader,
  hideLoader,
  redirectTo,
  OurTeamActionTypes,
  addOurTeamFailed,
  getOurTeamSuccess,
  getOurTeamFailed,
  viewOurTeamSuccess,
  viewOurTeamFailed,
  editOurTeamFailed,
  deleteOurTeamSuccess,
  deleteOurTeamFailed,
  bulkOurTeamFailed,
  orderOurTeamFailed,
  getOurTeamRequest

} from "../actions";
import { IRootState } from "../interfaces";

let toastId: any = null;

// For Get Corporate
const getOurTeam = createLogic({
  type: OurTeamActionTypes.GET_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    let params = action.payload;
    for (const property in params) {
      if (!params[property]) delete params[property];
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.GET_OUR_TEAM.service,
      ApiRoutes.GET_OUR_TEAM.url,
      ApiRoutes.GET_OUR_TEAM.method,
      ApiRoutes.GET_OUR_TEAM.authenticate,
      params,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      // Store for search and pagination changes show on table
      dispatch(
        getOurTeamSuccess({
          teamData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(getOurTeamFailed());
      done();
    }
  },
});

// For Add Team
const addOurTeam = createLogic({
  type: OurTeamActionTypes.ADD_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    // Create Form Data for upload image
    let formData = new FormData();
    for (const property in action.payload) {
      formData.append(property, action.payload[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ADD_OUR_TEAM.service,
      ApiRoutes.ADD_OUR_TEAM.url,
      ApiRoutes.ADD_OUR_TEAM.method,
      ApiRoutes.ADD_OUR_TEAM.authenticate,
      undefined,
      formData
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        redirectTo({
          path: AppRoutes.OUR_TEAM,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(addOurTeamFailed());
      done();
    }
  },
});

// For View Single Our Team
const viewOurTeam = createLogic({
  type: OurTeamActionTypes.VIEW_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const { action }: any = data;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.VIEW_OUR_TEAM.service,
      ApiRoutes.VIEW_OUR_TEAM.url.replace(":id", action.payload),
      ApiRoutes.VIEW_OUR_TEAM.method,
      ApiRoutes.VIEW_OUR_TEAM.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      dispatch(
        viewOurTeamSuccess({
          ourTeamView: response.data.data,
        })
      );
      dispatch(
        getOurTeamSuccess({
          teamData: response.data.data,
          totalRecords: response.data.totalRecords,
        })
      );
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(viewOurTeamFailed());
      done();
    }
  },
});

// For Edit Our Team
const editOurTeam = createLogic({
  type: OurTeamActionTypes.EDIT_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const { id, props, ...restParams } = action.payload;
    let formData = new FormData();
    for (const property in restParams) {
      formData.append(property, restParams[property]);
    }
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.EDIT_OUR_TEAM.service,
      ApiRoutes.EDIT_OUR_TEAM.url.replace(":id", id),
      ApiRoutes.EDIT_OUR_TEAM.method,
      ApiRoutes.EDIT_OUR_TEAM.authenticate,
      undefined,
      formData
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      props.history.goBack();
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(editOurTeamFailed());
      done();
    }
  },
});

// For Delete Our Team
const deleteOurTeam = createLogic({
  type: OurTeamActionTypes.DELETE_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.DELETE_OUR_TEAM.service,
      ApiRoutes.DELETE_OUR_TEAM.url.replace(":id", action.payload),
      ApiRoutes.DELETE_OUR_TEAM.method,
      ApiRoutes.DELETE_OUR_TEAM.authenticate,
      undefined
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let teamData: any = state.ourTeamReducer.teamData;
      let index: any = teamData.findIndex((e: any) => e._id === action.payload);
      teamData.splice(index, 1);
      dispatch(deleteOurTeamSuccess(teamData));
      dispatch(redirectTo({
        path:AppRoutes.OUR_TEAM
      }))
      dispatch(getOurTeamRequest({limit: 10,
        skip: 1}))
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        deleteOurTeamFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For Status Our Team
const statusOurTeam = createLogic({
  type: OurTeamActionTypes.STATUS_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.STATUS_OUR_TEAM.service,
      ApiRoutes.STATUS_OUR_TEAM.url.replace(":id", action.payload.id),
      ApiRoutes.STATUS_OUR_TEAM.method,
      ApiRoutes.STATUS_OUR_TEAM.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let teamData: any = state.ourTeamReducer.teamData;

      let index: any = teamData.findIndex(
        (e: any) => e._id === action.payload.id
      );
      teamData[index].isActive = action.payload.isActive;
      dispatch(deleteOurTeamSuccess(teamData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        deleteOurTeamFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});

// For Bulk Team Action
const bulkOurTeam = createLogic({
  type: OurTeamActionTypes.BULK_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    toast.dismiss();
    dispatch(showLoader());
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.BULK_OUR_TEAM.service,
      ApiRoutes.BULK_OUR_TEAM.url,
      ApiRoutes.BULK_OUR_TEAM.method,
      ApiRoutes.BULK_OUR_TEAM.authenticate,
      undefined,
      action.payload
    );
    if (response && !response.isError) {
      dispatch(hideLoader());
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      const state: IRootState = data.getState() as IRootState;
      let teamData: any = state.ourTeamReducer.teamData;
      let successData: any;
      if (action.payload.type === "Active") {
        successData = teamData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? true : e.isActive,
        }));
      }
      if (action.payload.type === "Deactive") {
        successData = teamData.map((e: any) => ({
          ...e,
          isActive: action.payload.ids.includes(e._id) ? false : e.isActive,
        }));
      }
      if (action.payload.type === "Delete") {
        successData = teamData.filter(
          (e: any) => !action.payload.ids.includes(e._id)
        );
      }
      dispatch(deleteOurTeamSuccess(successData));
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(
        bulkOurTeamFailed({
          error: response.messages[0],
        })
      );
      done();
    }
  },
});
const addOrderTeam = createLogic({
  type: OurTeamActionTypes.ORDER_OUR_TEAM_REQUEST,
  async process(data, dispatch: any, done) {
    const action: any = data.action;
    dispatch(showLoader());
    // Create Form Data for upload image
    const response = await new ApiHelper().FetchFromServer(
      ApiRoutes.ORDER_OUR_TEAM.service,
      ApiRoutes.ORDER_OUR_TEAM.url,
      ApiRoutes.ORDER_OUR_TEAM.method,
      ApiRoutes.ORDER_OUR_TEAM.authenticate,
      undefined,
      action.payload 
    );
    if (response && !response.isError) {
      if (!toast.isActive(toastId)) {
        toastId = toast.success(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(redirectTo({
        path:AppRoutes.OUR_TEAM
      }))
      dispatch(getOurTeamRequest({limit: 10,
        skip: 1}))
      done();
    } else {
      if (!toast.isActive(toastId)) {
        toastId = toast.error(response.messages[0]);
      }
      dispatch(hideLoader());
      dispatch(orderOurTeamFailed());
      done();
    }
  },
});

export const OurTeamLogics = [
  addOurTeam,
  getOurTeam,
  viewOurTeam,
  editOurTeam,
  deleteOurTeam,
  statusOurTeam,
  bulkOurTeam,
  addOrderTeam
];
