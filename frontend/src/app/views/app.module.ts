import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { LayoutComponent } from '../shared/layout/layout.component';
import { HeaderComponent } from '../shared/layout/header/header.component';
import { FooterComponent } from '../shared/layout/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from "./main/main.component";
import {SliderComponent} from "./main/slider/slider.component";
import {SharedModule} from "../shared/shared.module";
import {CarouselModule} from "ngx-owl-carousel-o";
import { PrivacyComponent } from './privacy/privacy.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    SliderComponent,
    PrivacyComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSnackBarModule,
    HttpClientModule,
    CarouselModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
