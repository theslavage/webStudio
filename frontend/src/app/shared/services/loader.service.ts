import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  show() {
    this._loading$.next(true);
  }

  hide(delay: number = 300) {
    setTimeout(() => {
      this._loading$.next(false);
    }, delay);
  }
}
