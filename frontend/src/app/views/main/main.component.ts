import { Component, OnInit } from '@angular/core';
import {ArticleTopService} from "../../shared/services/article-top.service";
import {ArticleType} from "../../../types/article.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articleTop: ArticleType[] = [];

  constructor(private articleTopService: ArticleTopService) { }

  ngOnInit(): void {
    this.articleTopService.getTopCategories()
      .subscribe((data: ArticleType[]) => {
        this.articleTop = data;
      })
  }

}
