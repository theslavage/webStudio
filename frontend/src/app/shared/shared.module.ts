import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {ArticleCartComponent} from "./components/article-cart/article-cart.component";
import { ModalComponent } from './components/modal/modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {BlogComponent} from "../views/article/blog/blog.component";
import { ShortenDescriptionPipe } from './pipes/shorten-description.pipe';



@NgModule({
  declarations: [ArticleCartComponent, ModalComponent, ShortenDescriptionPipe],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [ArticleCartComponent, ModalComponent,],
})
export class SharedModule { }
