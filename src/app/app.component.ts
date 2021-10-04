import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import {BackendService} from './backend.service';
import { GetTickets } from './store/ticket/ticket.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tickets = this.backend.tickets();
  users = this.backend.users();

  constructor(private backend: BackendService,
    private store: Store) {}

  ngOnInit(){
    this.store.dispatch(new GetTickets);
  }
}
