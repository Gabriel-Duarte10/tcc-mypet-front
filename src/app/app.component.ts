import { Component, OnInit } from '@angular/core';
import authRoutes from '../core/routes/auth-routes';
import featuresRoutes from '../core/routes/features-routes';
import { AuthService } from 'src/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService, readonly router: Router) {}

  ngOnInit(): void {
    this.auth.checkAuth().subscribe(
      (res) => {
        if (res) {
          this.router.resetConfig(authRoutes);
        } else {
          this.router.resetConfig(featuresRoutes);
        }
      }
    );
  }
}
