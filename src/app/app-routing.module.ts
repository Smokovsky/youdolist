import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsComponent } from './components/boards/boards.component';
import { BoardComponent } from './components/board/board.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { LoginPageGuard } from './services/login-page.guard';


const routes: Routes = [
  { path: '', redirectTo: '/boards', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [LoginPageGuard] },
  { path: 'boards', component: BoardsComponent, canActivate: [AuthGuard] },
  { path: 'board/:id', component: BoardComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: 'access-denied', component: AccessDeniedComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotFoundComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard,
              LoginPageGuard]
})
export class AppRoutingModule { }
export const routingComponents = [BoardsComponent,
                                  BoardComponent,
                                  NotFoundComponent,
                                  AccessDeniedComponent,
                                  LoginComponent];
