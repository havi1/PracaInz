import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, exhaustAll } from 'rxjs';
import { CottagesService } from 'src/app/services/cottages.service';
import { UserService } from 'src/app/services/user.service';
import { Reservation } from 'src/app/shared/models/reservation.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit {
  changePassword!:FormGroup;
  user!:User;
  reservations:Reservation[] = [];
  isUserAuthenticated!: boolean;
  isUserReservations = true;
  isUserData = false;
  isPasswordChange = false;
  constructor(private message:NzMessageService, private cottagesService:CottagesService, private formBuilder: FormBuilder, activatedRoute:ActivatedRoute,private userService: UserService) {
    this.userService.isAuth.subscribe(isAuth => {
      this.isUserAuthenticated = isAuth;
    });
    let reservationsObservable:Observable<User>;
    let reservationsRoomsObservable:Observable<Reservation[]>;
    activatedRoute.params.subscribe((params) => {
      if(params.userId) {
        reservationsObservable = this.userService.getOneUser(params.userId);
        reservationsRoomsObservable = this.cottagesService.getMyReservations(params.userId);
      }
      reservationsObservable.subscribe((serverUser) => {
        this.user = serverUser;
      })
      reservationsRoomsObservable.subscribe((serverReservations) => {
        this.reservations = serverReservations;
        console.log(serverReservations);
      })
    })
  }

  ngOnInit(): void {
    this.changePassword = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      newPasswordCheck: ['', Validators.required]
    })
  }

  get fc() {
    return this.changePassword.controls;
  }

  changeUserPassword() {
if(this.changePassword.valid && this.isUserAuthenticated) {
  if(this.fc.newPassword.value === this.fc.newPasswordCheck.value) {
    this.userService.editPassword({userId: this.user.id, oldPassword: this.fc.oldPassword.value, newPassword: this.fc.newPassword.value, newPasswordCheck:this.fc.newPasswordCheck.value}).subscribe({
      next: (response) => {
        this.message.success(response);
      },
      error: (error) => {
        if(error.error) {
          this.message.error(error.error)
        } else {
          this.message.error("Błąd zmiany hasła");
        }
      }
    });
  }
}
  }

  deleteReservation(id: string) {
    if(this.isUserAuthenticated) {
    this.cottagesService.deleteReservation(id).subscribe({
      next: (response) => {
        window.location.reload();
        this.message.success("Anulowano rezerwację");
        },
      error: (error) => this.message.error("Błąd przy anulowaniu rezerwacji")
    });
  }
  }

  openUserData() {
    this.isUserData = true;
    this.isPasswordChange = false;
    this.isUserReservations = false;
  }

  openPasswordChange() {
    this.isPasswordChange = true;
    this.isUserData = false;
    this.isUserReservations = false;
  }

  openUserReservations() {
    this.isPasswordChange = false;
    this.isUserData = false;
    this.isUserReservations = true;
  }
}
