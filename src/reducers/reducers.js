import * as actionTypes from '../actions/actionTypes';
import { modals } from '../router';

const initialState = {
  page: false,
  pageData: {},
  queryParams: {},
  inited: false,
  oldAdData: {},
  ads: []
};

let navHistory = [];

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.NAVIGATE: {
      const historyLen = navHistory.length - 1;
      const isBack = action.from && action.from.name === navHistory[historyLen] && navHistory[historyLen - 1] === action.to.name;

      if (isBack) {
        navHistory.pop();
      } else {
        navHistory.push(action.to.name);
      }

      let newState = {
        pageData: state.pageData,
        page: action.to.name
      };
      newState.pageData[action.to.name] = Object.assign({}, action.to.params);

      return Object.assign({}, state, newState);
    }

    case actionTypes.SET_INITIAL_QUERY_PARAMS: {
      return Object.assign({}, state, {
        queryParams: action.queryParams,
        hashParams: action.hashParams
      });
    }

    case actionTypes.SET_DATA: {
      return Object.assign({}, state, {
        pageData: Object.assign({}, state.pageData, {
          [action.page]: Object.assign({}, state.pageData[action.page], {
            [action.field]: action.value
          })
        })
      });
    }

    case actionTypes.INIT: {
      return Object.assign({}, state, {
        ads: action.ads,
        inited: true
      });
    }

    case actionTypes.SET_ADS: {
      return Object.assign({}, state, {ads: action.ads});
    }

    default:
      return state;
  }
};