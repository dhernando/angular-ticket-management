import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { map, skip } from 'rxjs/operators';
import { BackendService } from 'src/app/backend.service';
import { Ticket } from 'src/app/models/ticket';
import { User } from 'src/app/models/user';
import { AddTicket, SetSelectedTicket, UpdateTicket } from 'src/app/store/ticket/ticket.actions';
import { TicketState } from 'src/app/store/ticket/ticket.state';

const TICKET_CREATED_MESSAGE = 'Ticket created successfully';
const TICKET_UPDATED_MESSAGE = 'Ticket updated successfully';
const INVALID_TICKET_MESSAGE = 'Invalid Ticket';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @Select(TicketState.getSelectedTicket) selectedTicket: Observable<Ticket>;
  usersSubscription: Subscription;
  users: User[];
  ticket: Ticket;
  
  emptyTicket: Ticket = {
    id: null,
    description: '',
    assigneeId: null,
    completed: false
  }

  ticketForm: FormGroup;
  isCreateMode: boolean = false;

  constructor(private route: ActivatedRoute,
    private store: Store,
    private backendService: BackendService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.getTicket();
    this.getUsers();

    this.selectedTicket.pipe(skip(1)).subscribe(ticket => {
      if(!!ticket){
        this.generateFormBuilder(ticket);
      } else{
        this.exit(INVALID_TICKET_MESSAGE);
      };
    });
  }
  
  getTicket() {
    const id = this.route.snapshot.paramMap.get('id');
    //New ticket
    if(!id){
      this.isCreateMode = true;
      this.generateFormBuilder();
    } else {
      this.store.dispatch(new SetSelectedTicket(+id));
    }
  }

  getUsers(){
    this.usersSubscription = this.backendService.users()
    .pipe(
      map(users => this.users = users)
    ).subscribe();
  }

  //create form builder
  generateFormBuilder(ticket = this.emptyTicket){
    this.ticket = ticket;
    this.ticketForm = this.fb.group({
      description: [ticket.description, Validators.required],
      assigneeId: [ticket.assigneeId, Validators.required],
      completed: [ticket.completed]
    })
  }

  submitForm(){
    console.log(this.ticketForm.value);
    //Check if ticket exists and has an ID for update
    if(this.ticket && this.ticket.id !== null){
      this.store.dispatch(new UpdateTicket(this.ticket.id, this.ticketForm.value)).subscribe(() => {
        this.exit(TICKET_UPDATED_MESSAGE);
      });
    } else{
      this.store.dispatch(new AddTicket(this.ticketForm.value)).subscribe(() => {
        this.exit(TICKET_CREATED_MESSAGE);
      });
    }
  }

  exit(message = null){
    if(message){
      alert(message);
    }
    this.router.navigateByUrl('/tickets');
  }

  ngOnDestroy() {
    //Unsubscribe
    if(this.usersSubscription){
      this.usersSubscription.unsubscribe();
    }
  }

}
