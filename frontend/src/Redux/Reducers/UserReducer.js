import { UPDATE_IS_AUTHENTICATED } from "../Actions/ActionTypes";
let initial_state = {
  isAuthenticated: false,
};

export const userReducer = (state = initial_state, action) => {
  switch (action.type) {
    case UPDATE_IS_AUTHENTICATED: {
      return { ...state, isAuthenticated: action.payload };
    }
    default: {
      return state;
    }
  }
};
