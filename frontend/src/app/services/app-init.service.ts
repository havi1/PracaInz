import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Observable, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(private userService: UserService) {}

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
      forkJoin({
        isAuth: this.userService.checkAuthStatus().pipe(take(1)),
        isAdmin: this.userService.checkAdminStatus().pipe(take(1))
      }).subscribe({
        next: ({isAuth, isAdmin}) => {
          resolve(true);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}