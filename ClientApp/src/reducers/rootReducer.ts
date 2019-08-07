import { Device } from "../class/Device";
import { GpsPosition } from "../class/GpsPosition";
import { LookupItem } from "../class/LookupItem";

const initState = {
  deviceList: new Array<Device>(),
  lookupList: new Array<LookupItem>(),
  gpsPositionList: new Array<GpsPosition>(),
  isSaved: false,
  isDeleted: false,
}

const rootReducer = (state = initState, action: any) => {
  const newState = { ...state };
  switch (action.type) {

    case "GPS_POSITION_LIST":
      newState.gpsPositionList = action.payload
      newState.gpsPositionList.map(item => {
        item.display = true;
      })
      return newState;

    case "GPS_POSITION_HIDE":
      var indexPosition = newState.gpsPositionList.findIndex(p => p.gpsPositionId == action.payload);
      newState.gpsPositionList[indexPosition].display = !newState.gpsPositionList[indexPosition].display;
      newState.gpsPositionList = newState.gpsPositionList.slice(0, newState.gpsPositionList.length);
      return newState;

    case "TRACKER_LIST":
      newState.deviceList = action.payload
      return newState;

    case "TRACKER_LOOKUP_LIST":
      newState.lookupList = action.payload
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