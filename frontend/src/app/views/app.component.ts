import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        // если это главная страница — плавный режим
        if (url === '/' || url.startsWith('/#')) {
          document.documentElement.style.scrollBehavior = 'smooth';
          document.body.style.scrollBehavior = 'smooth';
        } else {
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';
        }
      });

    // слушаем клики по якорям, чтобы прокрутка шла плавно
    this.router.events.subscribe((event: any) => {
      if (event?.anchor) {
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(event.anchor);
        }, 100); // даём отрендериться странице
      }
    });
  }
}
