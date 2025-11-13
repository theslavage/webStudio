import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../core/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged = false;
  userName: string | null = null;
  showMenu = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isLogged = this.auth.getIsLoggedIn();

    this.auth.isLogged$.subscribe(isLoggedIn => {
      this.isLogged = isLoggedIn;
      if (!isLoggedIn) this.showMenu = false;
    });

    this.auth.userName$.subscribe(name => {
      this.userName = name;
    });
  }

  toggleMenu() {
    if (this.isLogged) {
      this.showMenu = !this.showMenu;
    }
  }

  logout() {
    this.auth.logout();
    this.showMenu = false;
  }
}
