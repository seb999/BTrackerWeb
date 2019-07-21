import { Device } from "../class/Device";

const initState = {
  userId: "",
  userEmail: "",
  isLogged: false,
  isFirstRender: true,
  deviceList: new Array<Device>(),
  isSaved : false,
  isDeleted : false,
}

const rootReducer = (state = initState, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case "REGISTER_USER":
      if (action.payload.result) {
        newState.userId = action.payload.userId;
        newState.userEmail = action.payload.email;
        newState.isLogged = action.payload.result;
        newState.isFirstRender = false;
      }
      else {
        newState.userId = "";
        newState.isLogged = false;
        newState.isFirstRender = false;
      }
      return newState;

    case "LOG_USER":
      if (action.payload.result) {
        newState.userId = action.payload.userId;
        newState.userEmail = action.payload.email;
        newState.isLogged = action.payload.result;
        newState.isFirstRender = false;
      }
      else {
        newState.userId = "";
        newState.isLogged = false;
        newState.isFirstRender = false;
      }
      return newState;

    case "LOGOUT_USER":
      newState.userId = "";
      newState.userEmail = "";
      newState.isLogged = false;
      newState.isFirstRender = true;
      return newState;

    case "TRACKER_LIST":
      newState.deviceList = action.payload
      return newState;

    case "TRACKER_SAVED":
      newState.deviceList = action.payload
      return newState;

    case "SAVING":
      newState.isSaved = true;
      return newState;

    case "SAVED":
      newState.isSaved = false;
      return newState;

    case "TRACKER_DELETED":
      newState.deviceList = action.payload
      return newState;

    case "DELETING":
      newState.isDeleted = true;
      return newState;

    case "DELETED":
      newState.isDeleted = false;
      return newState;
    default:
      return state;
  }
}

export default rootReducer