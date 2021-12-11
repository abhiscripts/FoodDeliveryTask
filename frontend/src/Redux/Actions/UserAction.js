import { UPDATE_IS_AUTHENTICATED } from "./ActionTypes";

export const update_auth = (payload) => {
  return { type: UPDATE_IS_AUTHENTICATED, payload };
};
