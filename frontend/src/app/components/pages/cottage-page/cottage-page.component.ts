import { UserService } from './../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { CottagesService } from 'src/app/services/cottages.service';
import { Cottage } from 'src/app/shared/models/cottage.model';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { Comment } from 'src/app/shared/models/comment.model';
import { VisibleHeaderService } from 'src/app/services/visible-header.service';
import { DOCUMENT } from '@angular/common';


export const dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const startDate = formGroup.get('startDate')?.value;
  const endDate = formGroup.get('endDate')?.value;
  return startDate && endDate && new Date(startDate) >= new Date(endDate) ? { dateRangeInvalid: true } : null;
};

@Component({
  selector: 'app-cottage-page',
  templateUrl: './cottage-page.component.html',
  styleUrls: ['./cottage-page.component.scss']
})


export class CottagePageComponent implements OnInit {
  @ViewChild('opinionWrapper') opinionWrapper!: ElementRef;
  imageUrlString!:string;
  i = 0;
  averageRating: number = 0;
 ratingCount: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  rating = 3;
  imageUrlsLength!:number;
  isGalleryOpen = false;
  isCreateCommentOpen = false;
  isModalOpen = false;
  user!:User;
  cottage!: Cottage;
  comments:Comment[] = [];
  reservationForm: FormGroup;
  commentForm: FormGroup;
  startDate!: string;
  endDate!: string;
  isAvailable!: boolean;
  today!:string;
  availabilityChecked = false;
  isButtonDisabled: boolean = true;
  inputValue = '';
  isUserAuthenticated!: boolean;
  isButtonDisabledReservation: boolean = true;


constructor(@Inject(DOCUMENT) private document: Document,private router: Router, private message:NzMessageService, private userService:UserService, activatedRoute:ActivatedRoute,
  private cottageService:CottagesService,private fb: FormBuilder,private visibleHeaderService:VisibleHeaderService){
  let commentsObservable:Observable<Comment[]>
  this.today = new Date().toISOString().split('T')[0];
  this.userService.isAuth.subscribe(isAuth => {
    this.isUserAuthenticated = isAuth;
  });
  userService.userObservable.subscribe((newUser) =>{
    this.user = newUser;
    console.log(this.user.id);
      })

      activatedRoute.params.subscribe((params) =>{
        if(params.id)
        cottageService.getCottageById(params.id).subscribe(serverRoom => {
      this.cottage = serverRoom;
      this.imageUrlString = this.cottage.imageUrls[this.i];
      this.imageUrlsLength = this.cottage.imageUrls.length;
      const roomId = params.id;
      commentsObservable = this.cottageService.getComments(roomId);
      commentsObservable.subscribe((serverComments) => {
        this.comments = serverComments;
        this.calculateAverageRating();
      })
    });
      })

  this.reservationForm = this.fb.group({
    roomId: [''],
    userId: [''],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    totalPrice: ['']
  }, {validators:dateRangeValidator});

  this.commentForm = this.fb.group({
    roomId: [''],
    userId: [''],
    createDate: [''],
    text: [''],
    rating:['']
  })
}

PrevImage() {
     if(this.i === 0) {
      this.i = this.imageUrlsLength -1;
      this.imageUrlString = this.cottage.imageUrls[this.i];

     } else {
      this.i = this.i - 1;
      this.imageUrlString = this.cottage.imageUrls[this.i];
     }
}

NextImage() {
  if(this.i === this.imageUrlsLength - 1) {
    this.i = 0
    this.imageUrlString = this.cottage.imageUrls[this.i];
  } else {
    this.i = this.i + 1;
    this.imageUrlString = this.cottage.imageUrls[this.i];
  }
}

scrollRight() {
  this.opinionWrapper.nativeElement.scrollLeft += this.opinionWrapper.nativeElement.offsetWidth;
}

scrollLeft() {
  this.opinionWrapper.nativeElement.scrollLeft -= this.opinionWrapper.nativeElement.offsetWidth;
}

checkDates() {
  if (this.startDate && this.endDate) {
    this.isButtonDisabled = this.startDate >= this.endDate;
  }
}

checkDatesReservation() {
  if (this.reservationForm.value.startDate && this.reservationForm.value.endDate) {
    this.isButtonDisabledReservation = this.reservationForm.value.startDate  >= this.reservationForm.value.endDate;
  }
}

scrollTo(elementId: string): void {
  const element = this.document.querySelector(`#${elementId}`);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 100; // Odejmij 100px, aby uwzględnić header

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

checkAvailability() {
  this.cottageService.checkRoomAvailability(this.startDate, this.endDate, this.cottage.id).subscribe({
    next: (response) => {
      this.isAvailable = response.isAvailable;
      if(this.isAvailable) {
        this.message.success("Pokój jest dostępny!")
      } else {
        this.message.error("Pokój jest nie dostępny!")
      }
    },
    error: (error) => {
      console.error('Wystąpił błąd!', error);
    },
  });
}

onSubmit() {
  if (this.reservationForm.valid && this.isUserAuthenticated) {
    this.cottageService.checkRoomAvailability(this.reservationForm.value.startDate, this.reservationForm.value.endDate, this.cottage.id).subscribe({
    next: (response) => {
      this.isAvailable = response.isAvailable;
      if(this.isAvailable) {
        this.reservationForm.patchValue({
          userId: this.user.id
        });
        this.reservationForm.patchValue({
          roomId: this.cottage.id});
        this.cottageService.createReservation(this.reservationForm.value).subscribe({
          next: (response) => {
            this.message.success("Zarezerwowano pokój!")
            this.closeModal();
        },
          error: (error) => this.message.error("Wystąpił błąd!")
        });
      } else {
        this.message.error("Pokój jest nie dostępny w tym terminie!")
      }
    },
    error: (error) => {
      console.error('Wystąpił błąd!', error);
    },
  });
  }
}

setRating(value: number) {
  this.rating = value;
}

createComment() {
  if(this.isUserAuthenticated) {
    this.commentForm.patchValue({
      userId: this.user.id,
      roomId: this.cottage.id,
      createDate: new Date(),
      text: this.inputValue,
      rating: this.rating
    });

    this.cottageService.createComment(this.commentForm.value).subscribe({
      next:(response) => {
        this.message.success("Dodano komentarz");
        this.inputValue = '';
      },
      error:(error) => this.message.error("Błąd przy dodawaniu komentarza")
    })
  } else {
    this.router.navigate(["/login"]);
  }
}

calculateAverageRating() {
  let totalRating = 0;
  this.comments.forEach((comment, index) => {
    totalRating += comment.rating;
  });
  this.averageRating = totalRating / this.comments.length;
}


getStarType(index: number): string {
  const fullStars = Math.floor(this.averageRating);
  const halfStarIndex = fullStars;
  const hasHalfStar = this.averageRating % 1 >= 0.5;

  if (index < fullStars) {
    return 'star'; // Pełna gwiazdka
  } else if (hasHalfStar && index === halfStarIndex) {
    return 'star_half'; // Pół gwiazdki
  } else {
    return 'star_border'; // Pusta gwiazdka
  }
}


updateTotalPrice(): void {
  const startDate = this.reservationForm.get('startDate')?.value;
  const endDate = this.reservationForm.get('endDate')?.value;
  if (startDate && endDate) {
    const nights = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    const totalPrice = this.cottage.price * nights;
    this.reservationForm.patchValue({
      totalPrice: totalPrice,
    })
  }
}

onChanges(): void {
  this.reservationForm.get('startDate')?.valueChanges.subscribe(val => {
    this.updateTotalPrice();
  });
  this.reservationForm.get('endDate')?.valueChanges.subscribe(val => {
    this.updateTotalPrice();
  });
}

 ngOnInit(): void {
  this.onChanges();
 }

 openModal() {
  if(this.isUserAuthenticated) {
    this.isModalOpen = true;
    this.visibleHeaderService.hideHeader();
  }
  else {
    this.router.navigate(['/login']);
  }
}

closeModal() {
  this.isModalOpen = false;
  this.visibleHeaderService.showHeader();
}

openCreateComment() {
  if(this.isUserAuthenticated) {
    this.isCreateCommentOpen= true;
    this.visibleHeaderService.hideHeader();
  }
  else {
    this.router.navigate(['/login']);
  }
}

closeCreateComment() {
  this.isCreateCommentOpen = false;
  this.visibleHeaderService.showHeader();
}

openGallery() {
  this.isGalleryOpen = true;
  this.visibleHeaderService.hideHeader();

}

closeGallery() {
  this.isGalleryOpen = false;
  this.visibleHeaderService.showHeader();
}
}
