import {Component, Input} from '@angular/core';
import {Navbar} from "./navbar";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input() itens?: Navbar[];


}
