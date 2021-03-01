import { Aircraft } from "./Aircraft";
import { Airport } from "./Airport";

export class Log {
    logBookId? : number;
    userId? : string;
    aircraftModelId? : number;
    aircraftModel? : Aircraft;
    airportDepartureId? : number;
    airportDeparture? : Airport;
    airportArrivalId? : number;
    airportArrival? : Airport;

    logBookDate? : Date;
    logBookAircraftRegistration? : string;
    logBookDepartureTime? : string;
    logBookArrivalTime? : string;
    logBookTotalFlightTime?: number;
    logBookIFR? : boolean;
    logBookNight? :boolean;
    logBookPIC? : boolean;
    logBookCoPilot? : boolean;
    logBookDual? :boolean;
    logBookDescription? : string;
}