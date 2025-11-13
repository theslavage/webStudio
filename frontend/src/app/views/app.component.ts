import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import {LoaderService} from "../shared/services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    public loaderService: LoaderService,
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;

        if (url === '/' || url.startsWith('/#')) {
          document.documentElement.style.scrollBehavior = 'smooth';
          document.body.style.scrollBehavior = 'smooth';
        } else {
          document.documentElement.style.scrollBehavior = 'auto';
          document.body.style.scrollBehavior = 'auto';
        }
      });

    this.router.events.subscribe((event: any) => {
      if (event?.anchor) {
        setTimeout(() => {
          this.viewportScroller.scrollToAnchor(event.anchor);
        }, 100);
      }
    });
  }
}
