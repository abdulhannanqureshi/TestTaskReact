import { handleActions } from "redux-actions";
import { OurTeamActionTypes } from "./../actions";
import { IOurTeamModel } from "../interfaces";
import { OurTeamInitialState } from "../states";

export const ourTeamReducer = handleActions<IOurTeamModel, any>(
  {
    // For Get Our Team
    [OurTeamActionTypes.GET_OUR_TEAM_REQUEST]: (state, action) => ({
      ...state,
    }),
    [OurTeamActionTypes.GET_OUR_TEAM_SUCCESS]: (state, action) => ({
      ...state,
      teamData: action.payload.teamData,
      totalRecords: action.payload.totalRecords,
    }),
    [OurTeamActionTypes.GET_OUR_TEAM_FAILED]: (state, action) => ({
      ...state,
      isError: true,
    }),
    // For Add Our Team
    [OurTeamActionTypes.ADD_OUR_TEAM_REQUEST]: (state, action) => ({
      ...state,
    }),
    [OurTeamActionTypes.ADD_OUR_TEAM_FAILED]: (state, action) => ({
      ...state,
    }),
    // For View Sub Admin
    [OurTeamActionTypes.VIEW_OUR_TEAM_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [OurTeamActionTypes.VIEW_OUR_TEAM_SUCCESS]: (state, action) => ({
      ...state,
      ourTeamView: action.payload.ourTeamView,
      isLoading: false,
    }),
    [OurTeamActionTypes.VIEW_OUR_TEAM_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Edit Our Team
    [OurTeamActionTypes.EDIT_OUR_TEAM_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [OurTeamActionTypes.EDIT_OUR_TEAM_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
    // For Status & Delete Our Team
    [OurTeamActionTypes.DELETE_OUR_TEAM_REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [OurTeamActionTypes.DELETE_OUR_TEAM_SUCCESS]: (state, action) => ({
      ...state,
      teamData: action.payload,
      isLoading: false,
    }),
    [OurTeamActionTypes.DELETE_OUR_TEAM_FAILED]: (state, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
  OurTeamInitialState
);
