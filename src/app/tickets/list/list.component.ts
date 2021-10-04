import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Ticket } from 'src/app/models/ticket';
import { DeleteTicket } from 'src/app/store/ticket/ticket.actions';
import { TicketState } from 'src/app/store/ticket/ticket.state';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent {
  displayedColumns: string[] = ['id', 'description', 'actions'];
  @Select(TicketState.getTickets) tickets: Observable<Ticket[]>;
  loading: boolean;

  constructor(private store: Store) {}

  deleteTicket(id){
    this.store.dispatch(new DeleteTicket(id));
  }
}
