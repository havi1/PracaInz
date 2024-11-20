import { LoadingService } from './../../../services/loading.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { VisibleHeaderService } from 'src/app/services/visible-header.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
loginForm!:FormGroup;
isSubmitted = false;
returnUrl = '';
constructor(private loadingService: LoadingService, private formBuilder: FormBuilder,private userService: UserService,
  private activatedRoute: ActivatedRoute, private router:Router, private visibleHeaderService:VisibleHeaderService) {
    this.loadingService.hideLoading();
  }

ngOnInit(): void {
  this.loginForm = this.formBuilder.group({
    email:['', [Validators.required, Validators.email]],
    password:['',Validators.required]
  });

this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
this.visibleHeaderService.hideHeader();
}

ngOnDestroy() {
  this.visibleHeaderService.showHeader();
}

get fc() {
  return this.loginForm.controls;
}

submit() {
  this.isSubmitted = true;
  if(this.loginForm.invalid) return;
  this.userService.login({email:this.fc.email.value,
    password:this.fc.password.value}).subscribe(() => {
      const lastRoute = localStorage.getItem('lastRoute');
      if (lastRoute && !lastRoute.includes('/login')) {
        this.router.navigateByUrl(lastRoute);
      } else {

        this.router.navigate(['/']);
      }


  });
}
}
