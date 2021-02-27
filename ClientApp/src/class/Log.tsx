import { Aircraft } from "./Aircraft";

export class Log {
    logBookId? : number;
    userId? : string;
    aircraftModelId? : number;
    airportDepartureId? : number;
    airportArrivalId? : number;
    logBookDate? : Date;
    logBookAircraftRegistration? : string;
    aircraftModel? : Aircraft;
    logBookDeparturePlace? : string;
    logBookDepartureTime? : string;
    logBookArrivalPlace? : string;
    logBookArrivalTime? : string;
    logBookTotalFlightTime?: number;
    logBookIFR? : boolean;
    logBookNight? :boolean;
    logBookPIC? : boolean;
    logBookCoPilot? : boolean;
    logBookDual? :boolean;
    logBookDescription? : string;
}