import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardComponent } from './components/board/board.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';


const routes: Routes = [
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
  { path: 'boards', component: BoardsComponent },
  { path: 'board/:id', component: BoardComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [BoardsComponent,
                                  BoardComponent,
                                  NotFoundComponent,
                                  AccessDeniedComponent];
