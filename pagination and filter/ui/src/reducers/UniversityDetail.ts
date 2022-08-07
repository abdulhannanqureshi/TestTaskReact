import { handleActions } from 'redux-actions';
import { UniversityActionTypes } from './../actions';
import { IUniversityListingModel } from '../interfaces';
import { UniversityInitialState } from '../states';

export const universityReducer = handleActions<IUniversityListingModel, any>(
  {
    [UniversityActionTypes.GET_UNIVERSITY_REQUEST]: (state = UniversityInitialState, action) => ({
      ...state,
      isLoading: true,
    }),
    [UniversityActionTypes.GET_UNIVERSITY_SUCCESS]: (state = UniversityInitialState, action) => ({
      ...state,
      currentPage: action.payload.currentPage,
      universityData: action.payload.universityData,
      totalRecords: action.payload.totalRecords,
      isLoading: false,
    }),
    [UniversityActionTypes.VIEW_SPECIFIC_UNIVERSITY_SUCCESS]: (state = UniversityInitialState, action) => ({
      ...state,
      universityInfo:action.payload.universityInfo,
      isLoading: false,
    }),

    [UniversityActionTypes.GET_UNIVERSITY_FAILED]: (state = UniversityInitialState, action) => ({
      ...state,
      isLoading: false,
      isError: true,
    })  
  },
  UniversityInitialState,
);
