export class Log {
    logBookId? : number;
    userId? : string;
    logBookDate? : Date;
    logBookAircraftRegistration? : string;
    logBookAircraftModel? : string;
    logBookDeparturePlace? : string;
    logBookDepartureTime? : Date;
    logBookArrivalPlace? : string;
    logBookArrivalTime? : Date;
    logBookTotalFlightTime?: number;
    logBookIFR? : boolean;
    logBookNight? :boolean;
    logBookPIC? : string;
    logBookCoPilot? : string;
    logBookDual? :boolean;
}