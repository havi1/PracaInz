import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CottagesService } from 'src/app/services/cottages.service';
import { UserService } from 'src/app/services/user.service';
import { VisibleHeaderService } from 'src/app/services/visible-header.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user!:User;
  isVisible!: Observable<boolean>;
  isUserAuthenticated!: boolean;
  isUserAdmin!: boolean;
constructor(private userService:UserService, private visibleHeaderService:VisibleHeaderService, private cottagesService:CottagesService) {
  userService.userObservable.subscribe((newUser) =>{
this.user = newUser;
  })
  this.userService.isAuth.subscribe(isAuth => {
    this.isUserAuthenticated = isAuth;
  });

  this.userService.isAdmin.subscribe(isAdmin => {
    this.isUserAdmin = isAdmin;
  });
  this.isVisible = this.visibleHeaderService.isVisible$;
}

  logout() {
     this.userService.logout();
  }
}
