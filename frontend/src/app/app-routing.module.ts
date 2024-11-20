import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { CottagePageComponent } from './components/pages/cottage-page/cottage-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminReservationsComponent } from './components/pages/admin-reservations/admin-reservations.component';
import { AdminGuard } from './auth/admin.guard';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { AddRoomComponent } from './components/pages/add-room/add-room.component';
import { UserProfilComponent } from './components/pages/user-profil/user-profil.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path: 'search/:searchTerm', component:HomeComponent},
  {path:'cottage/:id', component:CottagePageComponent},
  {path:'tag/:tag', component:HomeComponent},
  {path:'login',component:LoginPageComponent},
  {path:'sort/:sortName', component:HomeComponent},
  {path:'filters/:filterName', component: HomeComponent},
  {path:'user-profile/:userId', component: UserProfilComponent, canActivate: [AuthGuard]},
  {path:'register', component: RegisterPageComponent},
  {path:'add',component:AddRoomComponent, canActivate: [AuthGuard, AdminGuard]},
  {path:'admin-reservations', component: AdminReservationsComponent, canActivate: [AuthGuard, AdminGuard]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
