import { Component } from '@angular/core';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopNavComponent extends SigninComponent {
}
