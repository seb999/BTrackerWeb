import { Device } from "../class/Device";
import { GpsPosition } from "../class/GpsPosition";
import { LookupItem } from "../class/LookupItem";
import { Switchs } from "../class/Switch";

const initState = {
  trackerList: new Array<Device>(),
  switchList: new Array<Switchs>(),
  doorSwitch : new Switchs(),
  lookupTrackerList: new Array<LookupItem>(),
  gpsPositionList: new Array<GpsPosition>(),
  isGpsDeleted: false,
  isTrackerSaved: false,
  isTrackerDeleted: false,
  isTrackerUpdated: false,
  isSwitchUpdated: false,
}

const rootReducer = (state = initState, action: any) => {
  const newState = { ...state };
  switch (action.type) {

    case "GPS_POSITION_LIST":
      newState.gpsPositionList = action.payload
      newState.gpsPositionList.forEach(item => {
        item.display = true;
      })
      return newState;

    case "GPS_POSITION_HIDE":
      var indexPosition = newState.gpsPositionList.findIndex(p => p.gpsPositionId === action.payload);
      newState.gpsPositionList[indexPosition].display = !newState.gpsPositionList[indexPosition].display;
      newState.gpsPositionList = newState.gpsPositionList.slice(0, newState.gpsPositionList.length);
      return newState;

    case "GPS_DELETE_DATA":
      newState.isGpsDeleted = true;
      return newState;

    case "TRACKER_LIST":
      newState.trackerList = action.payload;
      return newState;

    case "SWITCH_LIST":
        newState.switchList = action.payload;
        return newState;

    case "DOOR":
        newState.doorSwitch = action.payload;
        return newState;

        case "OPEN_DOOR":
          newState.doorSwitch = action.payload;
          return newState;

    case "TRACKER_LOOKUP_LIST":
      newState.lookupTrackerList = action.payload
      return newState;

    case "TRACKER_SAVED":
      newState.isTrackerSaved = true;
      newState.trackerList = action.payload
      return newState;

    case "TRACKER_HIDE_SAVED_LABEL":
      newState.isTrackerSaved = false;
      return newState;

    case "TRACKER_DELETED":
      newState.isTrackerDeleted = true;
      newState.trackerList = action.payload
      return newState;

    case "TRACKER_HIDE_DELETED_LABEL":
      newState.isTrackerDeleted = false;
      return newState;

    case "TRACKER_UPDATED":
      newState.isTrackerUpdated = true;
      newState.trackerList = action.payload
      return newState;

      case "SWITCH_UPDATED":
        newState.isSwitchUpdated = true;
        newState.switchList = action.payload
        return newState;

    case "TRACKER_HIDE_UPDATED_LABEL":
      newState.isTrackerUpdated = false;
      return newState;

      case "SWITCH_HIDE_UPDATED_LABEL":
      newState.isSwitchUpdated = false;
      return newState;

    default:
      return state;
  }
}

export default rootReducer