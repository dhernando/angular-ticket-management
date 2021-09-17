import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BackendService, Ticket } from 'src/app/backend.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  subscription: Subscription;
  displayedColumns: string[] = ['id', 'description', 'actions'];
  tickets: MatTableDataSource<Ticket>;
  loading: boolean;

  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.loadTickets();
  }

  deleteTicket(id){
    this.backendService.delete(id).subscribe((tickets) => {
      this.tickets = new MatTableDataSource(tickets);
    });
  }

  loadTickets(){
    this.loading = true;
    this.subscription = this.backendService.tickets().subscribe(tickets => {
      this.tickets = new MatTableDataSource(tickets);
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
