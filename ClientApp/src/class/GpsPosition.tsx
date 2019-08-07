import { Device } from "./Device";

export interface GpsPosition {
    gpsPositionId: number;
    gpsPositionLongitude: number;
    gpsPositionLatitude: number;
    gpsPositionDate: Date;
    device: Device;
    display: boolean;
}