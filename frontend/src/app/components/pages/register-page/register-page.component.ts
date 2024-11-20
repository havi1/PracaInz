import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from 'src/app/services/loading.service';
import { UserService } from 'src/app/services/user.service';
import { VisibleHeaderService } from 'src/app/services/visible-header.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit,OnDestroy {
  isSubmitted = false;
  registerForm!:FormGroup;
  constructor(private message:NzMessageService, private formBuilder: FormBuilder,private userService: UserService,
    private activatedRoute: ActivatedRoute, private router:Router, private visibleHeaderService:VisibleHeaderService, private loadingService: LoadingService) {
      this.loadingService.hideLoading();
    }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name:['',Validators.required],
      email:['', [Validators.required, Validators.email]],
      address:['',Validators.required],
      password:['',Validators.required],
      password_repeat:['',Validators.required]

    });

  this.visibleHeaderService.hideHeader();
  }

  ngOnDestroy() {
    this.visibleHeaderService.showHeader();
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if(this.registerForm.valid) {
      if(this.fc.password.value===this.fc.password_repeat.value) {

        this.userService.registerUser(this.registerForm.value).subscribe({
          next:(response) => {
            this.message.success("Zarejestrowano użytkownika")
            this.router.navigate(['/login']);
          },
          error:(error) => this.message.error("Błąd przy rejestracji")
        })

      }
    }
  }
}
