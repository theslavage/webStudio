import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCartComponent} from "./components/article-cart/article-cart.component";
import { ModalComponent } from './components/modal/modal.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [ArticleCartComponent, ModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [ArticleCartComponent, ModalComponent],
})
export class SharedModule { }
