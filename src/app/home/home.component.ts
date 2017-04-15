import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchText: string;

  constructor(private router: Router) {

  }

  ngOnInit() {

  }

  search(searchText: string) {
    this.router.navigate(['search', searchText]);
  }
}
