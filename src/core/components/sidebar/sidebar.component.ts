import { Component, Input } from '@angular/core';
import { SidebarItem } from './sidebar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() itens?: SidebarItem[];

}
