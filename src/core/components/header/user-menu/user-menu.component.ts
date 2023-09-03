import { Component, OnInit } from '@angular/core';
import { User } from 'src/core/interfaces/user';
import { AuthService } from 'src/core/services/auth.service';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {
  user: User = {} as User;
  defaulUser = {
    name: 'Eu',
    foto: '/assets/default_avatar.png',
  } as User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.initializeUser();
  }

  async initializeUser() {
    const user = this.authService.getUser();
    this.user = user ? user : this.defaulUser;

    this.user.foto = this.user.foto ? this.user.foto : this.defaulUser.foto;
  }

  logout() {
    this.authService.logout();
  }
}
