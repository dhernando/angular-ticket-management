import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Ticket } from 'src/app/models/ticket';
import { AddTicket, DeleteTicket, UpdateTicket, SetSelectedTicket, GetTickets } from './ticket.actions';
import { BackendService } from 'src/app/backend.service';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';


export class TicketStateModel {
    tickets: Ticket[];
    selectedTicket: Ticket;
}

@State<TicketStateModel>({
  name: 'state',
  defaults: {
      tickets: [],
      selectedTicket: null
  }
})
@Injectable()
export class TicketState {

  constructor(private backendService: BackendService) {}

  @Selector()
  static getTickets(state: TicketStateModel) {
      return state.tickets;
  }

  @Selector()
  static getSelectedTicket(state: TicketStateModel) {
      return state.selectedTicket;
  }

  @Action(GetTickets)
  getTickets({getState, setState}: StateContext<TicketStateModel>) {
    return this.backendService.tickets().pipe(tap((result) => {
        const state = getState();
        setState({
            ...state,
            tickets: result,
        });
    }));
  }

  @Action(AddTicket)
  add({ getState, patchState }: StateContext<TicketStateModel>, { payload }: AddTicket) {
    return this.backendService.newTicket(payload).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      tap((result) => {
        const state = getState();
        patchState({
            tickets: [...state.tickets, result]
        });
      })
    );
  }

  @Action(UpdateTicket)
  update({ getState, setState }: StateContext<TicketStateModel>, {id, payload }: UpdateTicket) {
    return this.backendService.update(id, payload).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      tap((result) => {
        const state = getState();
        const ticketList = [...state.tickets];
        const ticketIndex = ticketList.findIndex(item => item.id === id);
        ticketList[ticketIndex] = result;
        setState({
            ...state,
            tickets: ticketList,
        });
      })
    );
  }

  @Action(DeleteTicket)
  delete({ getState, setState }: StateContext<TicketStateModel>, { id }: DeleteTicket) {
    return this.backendService.delete(id).pipe(tap(() => {
      const state = getState();
      const filteredArray = state.tickets.filter(item => item.id !== id);
      setState({
          ...state,
          tickets: filteredArray,
      });
    }));
  }

  @Action(SetSelectedTicket)
  setSelectedTicket({getState, setState}: StateContext<TicketStateModel>, { id }: SetSelectedTicket) {
    return this.backendService.ticket(id).pipe(tap((result) => {
      const state = getState();
      setState({
          ...state,
          selectedTicket: result,
      });
    }));  
  }
}