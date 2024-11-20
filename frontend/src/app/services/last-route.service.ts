import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LastRouteService {
  private previousUrl: string;

  constructor(private router: Router) {
    this.previousUrl = '/';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes('/login')) {
          this.previousUrl = event.url;
          localStorage.setItem('lastRoute', this.previousUrl);
        }
      }
    });
  }
}
