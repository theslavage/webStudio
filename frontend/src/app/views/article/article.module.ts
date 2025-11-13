import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { DetailComponent } from './detail/detail.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    BlogComponent,
    DetailComponent,
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ArticleModule { }
