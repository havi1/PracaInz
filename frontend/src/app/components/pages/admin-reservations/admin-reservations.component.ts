import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { CottagesService } from 'src/app/services/cottages.service';
import { UserService } from 'src/app/services/user.service';
import { Cottage } from 'src/app/shared/models/cottage.model';
import { Reservation } from 'src/app/shared/models/reservation.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventClickArg } from '@fullcalendar/core';
@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.component.html',
  styleUrls: ['./admin-reservations.component.scss']
})
export class AdminReservationsComponent implements OnInit {
  calendarEvents: { [key: string]: any[] } = {};
  calendarOptions: any;
  selectedCottageId: string | null = null;
  reservations:Reservation[] = [];
  cottages:Cottage[] = [];
  isUserAdmin!: boolean;
  letters = '0123456789ABCDEF';
  color = '#';
  constructor(private message:NzMessageService, private cottagesService:CottagesService, activatedRoute:ActivatedRoute,private userService: UserService, private modal:NzModalService) {
    this.userService.isAdmin.subscribe(isAdmin => {
      this.isUserAdmin = isAdmin;
    });
    let reservationsObservable:Observable<Reservation[]>;
    let roomsObservable:Observable<Cottage[]>;
        reservationsObservable = this.cottagesService.getAdminReservations();
      reservationsObservable.subscribe((serverReservations) => {
        this.reservations = serverReservations;
      })
      roomsObservable = cottagesService.getAll();

      roomsObservable.subscribe((serverRooms) => {
        this.cottages = serverRooms;
      })
      this.loadCottagesAndReservations();
  }

  ngOnInit() {

  }

  deleteReservation(id: string) {
    if(this.isUserAdmin) {
    this.cottagesService.deleteReservation(id).subscribe({
      next: (response) => {
        this.message.success("Anulowano rezerwację");
        window.location.reload();
        },
      error: (error) => this.message.error("Błąd przy anulowaniu rezerwacji")
    });
  }
  }

  selectCottage(cottageId: string) {
    this.selectedCottageId = cottageId;
    this.calendarOptions = { ...this.calendarOptions, [cottageId]: {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      events: this.prepareCalendarEventsForCottage(cottageId),
      eventClick: this.handleEventClick.bind(this)
    }};
  }

  loadCottagesAndReservations() {
    this.cottagesService.getAll().subscribe((cottages) => {
      this.cottages = cottages;
      cottages.forEach(cottage => {
        this.calendarEvents[cottage.id] = this.prepareCalendarEventsForCottage(cottage.id);
      });
      if (cottages.length > 0) {
        // Automatyczne wybieranie pierwszego domku z listy
        this.selectCottage(cottages[0].id);
      }
    });
  }

  prepareCalendarEventsForCottage(cottageId: string): any[] {
    return this.reservations.filter(reservation => reservation.roomId.id === cottageId)
      .map(reservation => ({
        title: `${reservation.userId.email} (${reservation.totalPrice}  zł)`,
        start: new Date(reservation.startDate),
        end: new Date(new Date(reservation.endDate).getTime() + 24 * 60 * 60 * 1000),
        color: this.getRandomColor(),
        allDay: true,
        id: reservation._id,
      }));
  }

  getRandomColor(): string {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    return randomColor;
  }

  handleEventClick(info: EventClickArg) {
    this.modal.confirm({
      nzTitle: 'Czy chcesz usunąć tę rezerwację?',
      nzContent: 'Po usunięciu, rezerwacja nie będzie można przywrócić.',
      nzOkText: 'Zatwierdź',
      nzCancelText: 'Anuluj',
      nzOnOk: () => {
        const reservationId = info.event.id as string; // Zakładając, że id jest typu string
        this.deleteReservation(reservationId);
      }
    });
  }
}
