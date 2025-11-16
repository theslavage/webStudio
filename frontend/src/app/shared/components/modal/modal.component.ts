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

  modalType: 'product' | 'slider' | 'callback' = 'product';

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
    this.form = this.fb.group({
      service: ['', Validators.required],
      name: ['', [Validators.required,
        Validators.pattern(/^[A-Za-zА-Яа-яЁё\s]+$/)]],
      phone: ['', [Validators.required,
        Validators.pattern(/^(\+?\d{10,15})$/)]],
    });

    this.contextSub = this.context$.subscribe((ctx: ModalContext | null) => {
      if (ctx?.payload?.serviceName) {
        this.form.patchValue({ service: ctx.payload.serviceName });
      }
    });

    this.modalService.context$.subscribe(ctx => {
      if (!ctx) return;

      this.modalType = ctx.source;

      const serviceCtrl = this.form.get('service');

      if (this.modalType === 'callback') {
        serviceCtrl?.clearValidators();
        this.form.patchValue({ service: '' });
      } else {
        serviceCtrl?.setValidators([Validators.required]);
      }

      serviceCtrl?.updateValueAndValidity();
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

  dropdownOpen = false;
  focusedIndex = -1;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      const i = this.services.indexOf(this.form.value.service);
      this.focusedIndex = i >= 0 ? i : 0;
    }
  }

  selectService(serviceName: string) {
    this.form.patchValue({ service: serviceName });

    const serviceControl = this.form.get('service');
    serviceControl?.markAsTouched();
    serviceControl?.markAsDirty();
    serviceControl?.updateValueAndValidity();

    this.dropdownOpen = false;
  }
}
