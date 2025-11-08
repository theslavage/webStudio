import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalContext = {
  source: 'product' | 'slider';
  payload?: any;
};


@Injectable({ providedIn: 'root' })
export class ModalService {
  private _isOpen$ = new BehaviorSubject<boolean>(false);
  private _context$ = new BehaviorSubject<ModalContext | null>(null);

  isOpen$ = this._isOpen$.asObservable();
  context$ = this._context$.asObservable();

  open(ctx: ModalContext) {
    this._context$.next(ctx);
    this._isOpen$.next(true);
    document.body.style.overflow = 'hidden'; // блокируем скролл под модалкой
  }

  close() {
    this._isOpen$.next(false);
    this._context$.next(null);
    document.body.style.overflow = ''; // возвращаем скролл
  }
}
