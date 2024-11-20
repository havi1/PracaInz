import { USER_AUTH, USER_GET_ONE, USER_PASSWORD_CHANGE } from './../shared/models/constants/urls';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, delay, forkJoin, map, mapTo, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL, USER_REGISTER_URL } from '../shared/models/constants/urls';
import {NzMessageService} from 'ng-zorro-antd/message';
import { Router } from '@angular/router';


const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  user!:User;
 private userSubject = new BehaviorSubject<User>(this.getUserFromStorage());
 public userObservable!:Observable<User>;
 private isAuthSubject = new BehaviorSubject<boolean>(false);
 private isAdminSubject = new BehaviorSubject<boolean>(false);
  constructor(private router:Router, private http:HttpClient, private message:NzMessageService) {
    this.checkAuthStatus();
    this.checkAdminStatus();
    this.userObservable = this.userSubject.asObservable();
    this.getToken()

  }
  login(userLogin: any): Observable<User | null> {
    return this.http.post<User>(USER_LOGIN_URL, userLogin, { withCredentials: true }).pipe(
      switchMap(user => {
        return forkJoin({
          isAuth: this.checkAuthStatus(),
          isAdmin: this.checkAdminStatus()
        }).pipe(mapTo(user));
      }),
      tap(user => {
        this.UserToStorage(user);
        this.userSubject.next(user);
        this.message.success("Witaj ponownie " + user.name);
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        let errorMsg = "Problem z procesem logowania";
        if (error.status === 401) {
          errorMsg = "Nazwa użytkownika albo hasło jest nieprawidłowe!";
        }
        this.message.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  editPassword(userPasswords: any): Observable<any> {
    return this.http.post(USER_PASSWORD_CHANGE, userPasswords, { responseType: 'text', withCredentials: true });
  }
  

  logout() {
    this.http.get(USER_AUTH + '/logout', { withCredentials: true }).subscribe(() => {
    });
    this.isAuthSubject.next(false);
    this.isAdminSubject.next(false); 
    
    this.userSubject.next(new User());
    this.message.success("Zostałeś wylogowany");
    localStorage.removeItem(USER_KEY);
    this.router.navigate(['/login']);
  }

  registerUser(registerUser: {name:string,email:string,address:string,password:string, password_repeat:string}):Observable<any> {
    return this.http.post(USER_REGISTER_URL, registerUser);
  }

  getToken(): string | null {
    const user = JSON.parse(localStorage.getItem('User') || '{}');
    return user.token || null;
  }

  public checkAuthStatus(): Observable<boolean> {
    return this.http.get(USER_AUTH + '/isAuth', { responseType: 'text', withCredentials: true })
      .pipe(
        map(response => response === 'true'),
        tap(isAuth => this.isAuthSubject.next(isAuth)) 
      );
  }
  
  public checkAdminStatus(): Observable<boolean> {
    return this.http.get(USER_AUTH + '/isAdmin', { responseType: 'text', withCredentials: true })
      .pipe(
        map(response => response === 'true'),
        tap(isAdmin => this.isAdminSubject.next(isAdmin))
      );
  }

get isAuth() {
  return this.isAuthSubject.asObservable();
}

get isAdmin() {
  return this.isAdminSubject.asObservable();
}

getOneUser(userId:string):Observable<User> {
return this.http.get<User>(USER_GET_ONE + userId);
}

  private UserToStorage(user:User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage():User {
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }


}
