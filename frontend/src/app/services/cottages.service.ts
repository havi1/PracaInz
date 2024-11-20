import { ROOMS_BY_SORT_URL, ROOMS_BY_ID_URL, ROOMS_TAGS_URL, ROOMS_BY_FILTER_URL, ROOM_RESERVATION, ROOM_COMMENT } from './../shared/models/constants/urls';
import { Injectable } from '@angular/core';
import { Cottage } from '../shared/models/cottage.model';
import { Tag } from '../shared/models/tag.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ROOMS_BY_SEARCH_URL, ROOMS_BY_TAG_URL, ROOMS_URL } from '../shared/models/constants/urls';
import { Reservation } from '../shared/models/reservation.model';
import { Comment } from '../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CottagesService {
  constructor(private http:HttpClient) { }

  getAll():Observable<Cottage[]> {
    return this.http.get<Cottage[]>(ROOMS_URL);
  }

  getAllCottagesBySearchTerm(searchTerm:string){
    return this.http.get<Cottage[]>(ROOMS_BY_SEARCH_URL + searchTerm);
  }

  getCottageById(id:string):Observable<Cottage> {
 return this.http.get<Cottage>(ROOMS_BY_ID_URL + id)
  }

  getAllTags():Observable<Tag[]> {
    return this.http.get<Tag[]>(ROOMS_TAGS_URL)
  }

  getAllCottagesByTag(tag:string):Observable<Cottage[]> {
    return tag === "Wszystkie"?
    this.getAll():
    this.http.get<Cottage[]>(ROOMS_BY_TAG_URL + tag);
  }

  getAllCottagesBySort(sortName:string):Observable<Cottage[]> {
    return this.http.get<Cottage[]>(ROOMS_BY_SORT_URL + sortName);
  }

  getAllCottagesByFilters(filterName:string, cenaMin: number, cenaMax: number, liczbaGosciMin: number, liczbaGosciMax: number, liczbaPokoiMin: number, liczbaPokoiMax: number): Observable<Cottage[]> {
    return this.http.post<Cottage[]>(ROOMS_BY_FILTER_URL + filterName, {cenaMin ,cenaMax, liczbaGosciMin, liczbaGosciMax, liczbaPokoiMin, liczbaPokoiMax });
    }

  createReservation(reservationData: { roomId: string; userId: string; startDate: Date; endDate: Date, totalPrice:number }):Observable<any> {
    return this.http.post(ROOM_RESERVATION + 'book', reservationData);
  }

  createComment(commentData: {userId:string; roomId: string; createDate: Date; text: string, rating:number}):Observable<any> {
    return this.http.post(ROOM_COMMENT + '/create', commentData)
  }

  getComments(roomId: string):Observable<Comment[]> {
   return this.http.post<Comment[]>(ROOM_COMMENT, {roomId})
  }

  getMyReservations(userId: string):Observable<Reservation[]> {
    return this.http.get<Reservation[]>(ROOM_RESERVATION + 'my-reservations/' + userId)
  }

  getAdminReservations():Observable<Reservation[]> {
    return this.http.get<Reservation[]>(ROOM_RESERVATION + '/admin-reservations')
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete(ROOM_RESERVATION + 'delete-reservation', { body: { id } }); // Uwaga: nie wszystkie implementacje HttpClient mogą wspierać `body` w DELETE
  }

  checkRoomAvailability(startDate: string, endDate: string, roomId: string): Observable<{isAvailable: boolean}> {
    return this.http.get<{isAvailable: boolean}>(ROOM_RESERVATION + 'check-availability', {
      params: { startDate, endDate, roomId }
    });
  }


  uploadForm(name: string, price: number, rooms: number, maxGuests: number, beds: number, type: string, desc: string, desc_long: string, image: File,images:FileList, tag: string[]) {
    const formData = new FormData();
    formData.append('data', JSON.stringify({name, price, rooms, maxGuests, beds, type, desc, desc_long, tag}));
    formData.append('imageUrl', image);
    for (let i = 0; i < images.length; i++) {
      formData.append(`imageUrls`, images[i]);
    }
    return this.http.post(ROOMS_URL + '/upload', formData);
  }
  }
