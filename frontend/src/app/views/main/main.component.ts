import { Component, OnInit } from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {ModalService} from "../../shared/services/modal.service";
import {ArticleService} from "../../shared/services/article.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articleTop: ArticleType[] = [];

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 25,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false
  }

  reviews = [
    {
      name: 'Станислав',
      image: 'reviews1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'reviews2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'reviews3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

  constructor(private articleTopService: ArticleService,
              private modal: ModalService,) { }

  ngOnInit(): void {
    this.articleTopService.getTopCategories()
      .subscribe((data: ArticleType[]) => {
        this.articleTop = data;
      })
  }

  isModalOpen = false;

  closeModal() {
    this.isModalOpen = false;
  }

  openProductModal(serviceName: string) {
    this.modal.open({
      source: 'product',
      payload: { serviceName }
    });
  }
}
