import {Component, Input, OnInit} from '@angular/core';
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'article-cart',
  templateUrl: './article-cart.component.html',
  styleUrls: ['./article-cart.component.scss']
})
export class ArticleCartComponent implements OnInit {
  @Input() articleTops!: ArticleType;
  serverStaticPath = environment.serverStaticPath;
  isExpanded = false;

  constructor() { }

  ngOnInit(): void {
  }
}
