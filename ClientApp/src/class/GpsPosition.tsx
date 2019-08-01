import { Device } from "./Device";

export interface GpsPosition {
    gpsPositionLongitude : number;
    gpsPositionLatitude : number;
    gpsPositionDate : Date;
    device : Device
}