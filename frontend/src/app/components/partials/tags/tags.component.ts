import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CottagesService } from 'src/app/services/cottages.service';
import { Tag } from 'src/app/shared/models/tag.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  cenaMinValue!:number;
  cenaMaxValue!:number;
  gosciMinValue!:number;
  gosciMaxValue!:number;
  pokoiMinValue!:number;
  pokoiMaxValue!:number;
tags?:Tag[];

constructor(cottageService:CottagesService, private router:Router){
  cottageService.getAllTags().subscribe(roomTag => {
    this.tags = roomTag;
  });
}

  ngOnInit(): void {

  }

  applyFilters(filterName: string) {
    const queryParams: any = {};
    if (!this.cenaMinValue) {
      this.cenaMinValue = 0;
    }
    if (!this.cenaMaxValue) {
      this.cenaMaxValue = 10000;
    }
    if (!this.gosciMinValue) {
      this.gosciMinValue = 0;
    }
    if (!this.gosciMaxValue) {
      this.gosciMaxValue = 10000;
    }
    if (!this.pokoiMinValue) {
      this.pokoiMinValue = 0;
    }
    if (!this.pokoiMaxValue) {
      this.pokoiMaxValue = 10000;
    }
    this.router.navigate(['/filters', filterName], {
      queryParams: {
        cenaMin: this.cenaMinValue,
        cenaMax: this.cenaMaxValue,
        gosciMin: this.gosciMinValue,
        gosciMax: this.gosciMaxValue,
        pokoiMin: this.pokoiMinValue,
        pokoiMax: this.pokoiMaxValue
      }
    });

  }
}
