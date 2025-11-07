import { Component } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent {
  currentIndex = 0;

  cards = [
    {
      image: '/assets/images/slider/Banner1.png',
      title: 'Продвижение в Instagram для вашего бизнеса  <span class="highlight">-15%</span>!',
      description: 'Предложение месяца',
      buttonText: 'Подробнее'
    },
    {
      image: '/assets/images/slider/Banner2.png',
      title: 'Нужен грамотный <span class="highlight">копирайтер</span>?',
      description: 'Акция',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      buttonText: 'Подробнее'
    },
    {
      image: '/assets/images/slider/Banner3.png',
      title: '<span class="highlight">6 место</span> в ТОП-10 SMM-агентств Москвы!',
      description: 'Новость дня',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      buttonText: 'Подробнее'
    }
  ];

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.cards.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
