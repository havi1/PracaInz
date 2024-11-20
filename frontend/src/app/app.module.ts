import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { NZ_I18N, en_GB } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchComponent } from './components/partials/search/search.component';
import { CottagePageComponent } from './components/pages/cottage-page/cottage-page.component';
import { TagsComponent } from './components/partials/tags/tags.component';
import { FiltersComponent } from './components/partials/filters/filters.component';
import { NotFoundComponent } from './components/partials/not-found/not-found.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { LastRouteService } from './services/last-route.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import {MatSelectModule} from '@angular/material/select'
import { AdminReservationsComponent } from './components/pages/admin-reservations/admin-reservations.component';
import { LoadingComponent } from './components/partials/loading/loading.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { AddRoomComponent } from './components/pages/add-room/add-room.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { FooterComponent } from './components/footer/footer.component';
import { UserProfilComponent } from './components/pages/user-profil/user-profil.component';
import { AppInitService } from './services/app-init.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(en);
export function initLastRouteService(lastRouteService: LastRouteService) {
  return () => lastRouteService;
}
export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    CottagePageComponent,
    TagsComponent,
    FiltersComponent,
    NotFoundComponent,
    LoginPageComponent,
    AdminReservationsComponent,
    LoadingComponent,
    RegisterPageComponent,
    AddRoomComponent,
    FooterComponent,
    UserProfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzIconModule,
    NzDropDownModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NzDropDownModule,
    NzPopconfirmModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NzUploadModule,
    FullCalendarModule,
    NzModalModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass : LoadingInterceptor, multi: true},
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
