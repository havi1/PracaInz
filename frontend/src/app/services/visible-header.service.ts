import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VisibleHeaderService {
  private isVisible = new BehaviorSubject<boolean>(true);
  isVisible$ = this.isVisible.asObservable();
  constructor() { }

  showHeader() {
    this.isVisible.next(true);
  }

  hideHeader() {
    this.isVisible.next(false);
  }
}
