import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { BackendService, Ticket, User } from 'src/app/backend.service';

const TICKET_CREATED_MESSAGE = 'Ticket created successfully';
const TICKET_UPDATED_MESSAGE = 'Ticket updated successfully';
const INVALID_TICKET_MESSAGE = 'Invalid Ticket';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  ticketSubscription: Subscription;
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
    private backendService: BackendService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.getTicket();
    this.getUsers();
  }
  
  getTicket() {
    const id = this.route.snapshot.paramMap.get('id');
    //New ticket
    if(!id){
      this.isCreateMode = true;
      this.generateFormBuilder();
    } else {
      this.ticketSubscription = this.backendService.ticket(+id)
      .pipe(
        tap(ticket => {
          if(typeof ticket !== 'undefined'){
            this.generateFormBuilder(ticket);
          } else{
            this.exit(INVALID_TICKET_MESSAGE);
          }
        })
      ).subscribe();
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
    //Check if ticket exists and has an ID for update
    if(this.ticket && this.ticket.id !== null){
      this.backendService.update(this.ticket.id, this.ticketForm.value)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      ).subscribe(response => {
        if(response.id !== null){
          this.exit(TICKET_UPDATED_MESSAGE);
        }
      });
    } else{
      this.backendService.newTicket(this.ticketForm.value)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      ).subscribe(response => {
        if(response.id !== null){
          this.exit(TICKET_CREATED_MESSAGE);
        }
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
    if(this.ticketSubscription){
      this.ticketSubscription.unsubscribe();
    }
    if(this.usersSubscription){
      this.usersSubscription.unsubscribe();
    }
  }

}
