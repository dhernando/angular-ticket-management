import { NgModule } from '@angular/core';
import { ListComponent } from './tickets/list/list.component';
import { DetailComponent } from './tickets/detail/detail.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tickets', pathMatch: 'full' },
  { path: 'tickets', component: ListComponent },
  { path: 'tickets/new', component: DetailComponent },
  { path: 'tickets/:id', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
