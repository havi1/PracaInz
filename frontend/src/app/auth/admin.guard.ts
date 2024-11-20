import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  isUserAdmin!: boolean;
  constructor(private authService: UserService, private router: Router) {
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isUserAdmin = isAdmin;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isUserAdmin) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
