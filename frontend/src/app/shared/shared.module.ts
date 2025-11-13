import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCartComponent} from "./components/article-cart/article-cart.component";
import { ModalComponent } from './components/modal/modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ShortenDescriptionPipe } from './pipes/shorten-description.pipe';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [ArticleCartComponent, ModalComponent, ShortenDescriptionPipe, LoaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  exports: [ArticleCartComponent, ModalComponent, LoaderComponent],
})
export class SharedModule { }
