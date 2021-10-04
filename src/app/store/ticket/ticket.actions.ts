import { Ticket } from "src/app/models/ticket";

export class GetTickets {
    static readonly type = '[Ticket Management] Get Tickets';
}

export class SetSelectedTicket {
    static readonly type = '[Ticket Management] Set Selected Ticket';
    constructor(public id: number) {}
}

export class AddTicket {
    static readonly type = '[Ticket Management] Add Ticket';
    constructor(public payload: Ticket) {}
}

export class UpdateTicket {
    static readonly type = '[Ticket Management] Update Ticket';
    constructor(public id: number, public payload: Ticket) {}
}

export class DeleteTicket {
    static readonly type = '[Ticket Management] Delete Ticket';
    constructor(public id: number) {}
}