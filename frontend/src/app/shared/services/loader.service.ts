import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isShowed$ = new BehaviorSubject<boolean>(false);


  constructor() { }


  show() {
    this.isShowed$.next(true);
  }

  hide(delay: number = 300) {
    setTimeout(() => {
      this.isShowed$.next(false);
    }, delay);
  }

}
