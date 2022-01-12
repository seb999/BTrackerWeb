import { Device } from "../class/Device";
import { GpsPosition } from "../class/GpsPosition";
import { LookupItem } from "../class/LookupItem";
import { Switchs } from "../class/Switch";
import { SmartHouseUser } from "../class/SmartHouseUser";
import { Log } from "../class/Log";
import { Terminal } from "../class/Cr_terminal";
import { Transfer } from "../class/Cr_transfer";
import { Asset } from "../class/Cr_asset";
import { Transaction } from "../class/Cr_transaction";

const initState = {
  terminalList: new Array<Terminal>(),
  transferList: new Array<Transfer>(),
  assetList: new Array<Asset>(),
  transactionList: new Array<Transaction>(),

  isSwitchUpdated: false,
  trackerList: new Array<Device>(),
  switchList: new Array<Switchs>(),
  doorSwitch: new Switchs(),
  userList: new Array<SmartHouseUser>(),
  logBookList: new Array<Log>(),
  isNewDoorCodeValid: true,
  lookupList: new Array<Array<LookupItem>>(),

  lookupTrackerList: new Array<LookupItem>(),
  gpsPositionList: new Array<GpsPosition>(),
  isGpsDeleted: false,
  isTrackerSaved: false,
  isTrackerDeleted: false,
  isTrackerUpdated: false,
  isLogSaved: false,
  isLogDeleted: false,
  isTransSaved: false,
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

    case "SMARTHOUSE_GET_USER_LIST":
      newState.userList = action.payload
      return newState;

    case "SMARTHOUSE_UPDATE_USER":
      newState.userList = action.payload
      return newState;

    case "SMARTHOUSE_CHECK_CODE":
      newState.isNewDoorCodeValid = action.payload
      return newState;

    case "SMARTHOUSE_SAVE_USER":
      newState.userList = action.payload
      return newState;

    case "LOG_LIST":
      newState.logBookList = action.payload
      return newState;

    case "LOG_SAVED":
      newState.isLogSaved = true;
      newState.logBookList = action.payload;
      return newState;

    case "LOG_SAVED_HIDE_LABEL":
      newState.isLogSaved = false;
      return newState;

    case "LOG_UPDATED":
      newState.isLogSaved = true;
      newState.logBookList = action.payload
      return newState;

    case "LOG_UPDATED_HIDE_LABEL":
      newState.isLogSaved = false;
      return newState;

    case "LOOKUP_LIST":
      newState.lookupList = action.payload;
      return newState;

    case "LOG_DELETED":
      newState.isLogDeleted = true;
      newState.logBookList = action.payload
      return newState;

    case "LOG_DELETED_HIDE_LABEL":
      newState.isLogDeleted = false;
      return newState;

    case "CR_TRANS_SAVED":
      newState.isTransSaved = true;
      return newState;

    case "CR_TRANS_SAVED_HIDE_LABEL":
      newState.isTransSaved = false;
      return newState;

    case "TERMINAL_LIST":
      newState.terminalList = action.payload;
      return newState;

    case "TRANSFER_LIST":
      newState.transferList = action.payload;
      return newState;

    case "BINANCE_BALANCE":
      newState.assetList = action.payload;
      return newState;

      case "BINANCE_TRANS_HISTORY":
      newState.transactionList = action.payload;
      return newState;


    default:
      return state;
  }
}

export default rootReducer