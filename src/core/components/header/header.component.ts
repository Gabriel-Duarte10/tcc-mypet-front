import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/core/services/breadcrumb.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public breadcrumbService: BreadcrumbService, private router: Router ) { }

  ngOnInit(): void {
  }
  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
