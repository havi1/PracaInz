import { CottagesService } from './../../../services/cottages.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Cottage } from 'src/app/shared/models/cottage.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchTerm = "";
  cottages:Cottage[] = [];

  constructor(private cottagesService:CottagesService, activatedRoute:ActivatedRoute, private userService:UserService) {
    let roomsObservable:Observable<Cottage[]>;
    activatedRoute.params.subscribe((params) => {
      if(params.searchTerm) {
        this.searchTerm = params.searchTerm;
      roomsObservable = this.cottagesService.getAllCottagesBySearchTerm(params.searchTerm);
      }
    else if(params.tag)
    roomsObservable = this.cottagesService.getAllCottagesByTag(params.tag);
      else if(params.sortName)
      roomsObservable = this.cottagesService.getAllCottagesBySort(params.sortName);
      else if (params.filterName) {
        const filterName = params.filterName;
  activatedRoute.queryParams.subscribe(params => {

    const cenaMin = params['cenaMin'];
    const cenaMax = params['cenaMax'];
    const gosciMin = params['gosciMin'];
    const gosciMax = params['gosciMax'];
    const pokoiMin = params['pokoiMin'];
    const pokoiMax = params['pokoiMax'];

    roomsObservable = this.cottagesService.getAllCottagesByFilters(filterName, cenaMin, cenaMax, gosciMin, gosciMax, pokoiMin, pokoiMax);
})
      }
    else
    roomsObservable = cottagesService.getAll();

    roomsObservable.subscribe((serverRooms) => {
      this.cottages = serverRooms;
    })
    })
  }

  ngOnInit(): void {

  }
}

