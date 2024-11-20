import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CottagesService } from 'src/app/services/cottages.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit{
  searchTerm = "";
constructor(activatedRoute:ActivatedRoute, private router:Router, private cottageService:CottagesService){
  activatedRoute.params.subscribe((params) => {
    if(params.searchTerm)
      this.searchTerm = params.searchTerm;
    
  });
}
ngOnInit(){}

search(term:string):void{
  if(term)
  this.router.navigateByUrl('/search/' + term);
}


}
