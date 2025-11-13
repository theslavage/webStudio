import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService, ModalContext } from '../../services/modal.service';
import {Observable, Subscription} from 'rxjs';
import {OrderService} from "../../services/order.service";
import {DefaultResponse, OrderRequest} from "../../../../types/order.type";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  isOpen$: Observable<boolean>;
  context$: Observable<ModalContext | null>;
  form!: FormGroup;

  callbackData = {
    name: '',
    phone: ''
  };

  modalType: 'product' | 'slider' | 'callback' = 'product';


  // список услуг
  services: string[] = [
    'Создание сайтов',
    'Продвижение',
    'Реклама',
    'Копирайтинг',
  ];

  isSuccess = false;
  isError = false;
  loading = false;

  private contextSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private orderService: OrderService
  ) {
    this.isOpen$ = this.modalService.isOpen$;
    this.context$ = this.modalService.context$;
  }


  ngOnInit() {
    // форма
    this.form = this.fb.group({
      service: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+?\d{10,15})$/)]]
    });

    // автозаполнение "service" если модалка открыта с определённым serviceName
    this.contextSub = this.context$.subscribe((ctx: ModalContext | null) => {
      if (ctx?.payload?.serviceName) {
        this.form.patchValue({ service: ctx.payload.serviceName });
      }
    });

    // отслеживаем тип модалки
    this.modalService.context$.subscribe(ctx => {
      if (ctx) {
        this.modalType = ctx.source;

        // -----------------------------------
        // 🔥 ЛОГИКА ДЛЯ CALLBACK
        // -----------------------------------
        if (this.modalType === 'callback') {
          // убираем проверку обязательности
          this.form.get('service')?.clearValidators();
          this.form.get('service')?.updateValueAndValidity();

          // очищаем значение service
          this.form.patchValue({ service: '' });
        }
        else {
          // если НЕ callback — возвращаем обязательность
          this.form.get('service')?.setValidators([Validators.required]);
          this.form.get('service')?.updateValueAndValidity();
        }
      }
    });
  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }



    this.loading = true;
    this.isError = false;


    const data: OrderRequest = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      service: this.modalType === 'callback'
        ? 'Обратный звонок'
        : this.form.value.service,
      type: 'order'
    };

    this.orderService.sendOrder(data).subscribe({
      next: (res: DefaultResponse) => {
        this.loading = false;
        if (!res.error) {
          this.isSuccess = true;
        } else {
          this.isError = true;
        }
      },
      error: () => {
        this.loading = false;
        this.isError = true;
      }
    });

  }

  closeModal() {
    this.isSuccess = false;
    this.isError = false;
    this.loading = false;
    this.form.reset();
    this.modalService.close();

  }

  ngOnDestroy(): void {
    this.contextSub?.unsubscribe();
  }

  dropdownOpen = false;
  focusedIndex = -1;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      const i = this.services.indexOf(this.form.value.service);
      this.focusedIndex = i >= 0 ? i : 0;
    }
  }

  selectService(s: string) {
    this.form.patchValue({ service: s });
    this.dropdownOpen = false;
  }

  onKeydown(e: KeyboardEvent) {
    if (!this.dropdownOpen) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.focusedIndex = (this.focusedIndex + 1) % this.services.length; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.focusedIndex = (this.focusedIndex - 1 + this.services.length) % this.services.length; }
    else if (e.key === 'Enter') { e.preventDefault(); this.selectService(this.services[this.focusedIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); this.dropdownOpen = false; }
  }

  submitCallback(event: Event) {
    event.preventDefault();

    console.log("Заявка на звонок:", this.callbackData);

    // Здесь можно отправить на сервер или в Telegram bot

    this.modalService.close();
  }



}
