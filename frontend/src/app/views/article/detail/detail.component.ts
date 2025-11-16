import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArticleService } from '../../../shared/services/article.service';
import { ArticleDetailResponseType } from '../../../../types/article-detail-response.type';
import { environment } from '../../../../environments/environment';
import { ArticleType } from '../../../../types/article.type';
import { CommentType } from '../../../../types/comment.type';
import { Subscription } from 'rxjs';
import {AuthService} from "../../../core/auth/auth.service";
import {CommentService} from "../../../shared/services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LoaderService} from "../../../shared/services/loader.service";


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  article: ArticleDetailResponseType | null = null;
  relatedArticle: ArticleType[] = [];
  comments: CommentType[] = [];
  isLoading = true;
  isLoadingMore = false;
  isLoggedIn = false;
  serverStaticPath = environment.serverStaticPath;

  commentActions: Record<string, 'like' | 'dislike' | null> = {};
  commentForm = new FormGroup({
    comment: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  private offset = 0;
  private readonly limit = 3;
  private routeSub!: Subscription;
  private authSub!: Subscription;
  private readonly initialLimit = 3;
  private readonly loadMoreLimit = 10;
  private totalComments = 0;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService,
    private commentService: CommentService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.authSub = this.authService.isLogged$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.isLoggedIn = this.authService.getIsLoggedIn();

    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      const url = params.get('url');
      if (url) {
        this.loadArticle(url);
      }
    });
  }

  private loadArticle(url: string): void {
    this.isLoading = true;
    this.loader.show();
    this.articleService.getArticleByUrl(url).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
        this.offset = 0;
        this.comments = [];
        this.loader.hide(1000);

        this.loadRelated(data.url);
        this.loadComments(data.id);

        if (this.isLoggedIn) {
          this.loadUserActions(data.id);
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке статьи', err);
        this.isLoading = false;
        this.loader.hide(1000);
      }
    });
  }

  private loadRelated(url: string): void {
    this.articleService.getRelatedArticles(url).subscribe({
      next: (res) => (this.relatedArticle = res),
      error: (err) => console.error('Ошибка при загрузке связанных статей:', err)
    });
  }

  private loadComments(articleId: string): void {
    this.loader.show();
    this.articleService.getComments(articleId, this.offset).subscribe({
      next: (res) => {
        this.totalComments = res.allCount;
        this.loader.hide(1000);
        if (this.offset === 0) {
          this.comments = [];
        }

        const limit = this.offset === 0 ? this.initialLimit : this.loadMoreLimit;
        const newComments = res.comments.slice(this.offset, this.offset + limit);
        this.comments.push(...newComments);
        this.offset += newComments.length;
      },
      error: () => {
        this.loader.hide(1000);
      }
    });
  }


  loadMoreComments(): void {
    if (!this.article) return;

    this.loader.show();
    this.isLoadingMore = true;
    this.articleService.getComments(this.article.id, this.offset, this.loadMoreLimit).subscribe({
      next: (res) => {
        this.comments.push(...res.comments);
        this.offset += res.comments.length;
        this.loader.hide(1000);
        this.isLoadingMore = false;
      },
      error: (err) => {
        console.error('Ошибка при подгрузке комментариев:', err);
        this.isLoadingMore = false;
        this.loader.hide(1000);
      }
    });
  }

  addComment(): void {
    if (!this.article) return;
    const text = this.commentForm.value.comment || '';
    if (!text.trim()) {
      this._snackBar.open('Введите текст комментария');
      return;
    }

    this.loader.show();

    this.commentService.addComment(this.article.id, text).subscribe({
      next: (res) => {
        this.loader.hide(1000);
        this._snackBar.open(res.message || 'Комментарий добавлен!');
        this.commentForm.reset();
        this.comments = [];
        this.offset = 0;
        this.loadComments(this.article!.id);
      },
      error: (err) => {
        this.loader.hide(1000);
        console.error('Ошибка при добавлении комментария:', err);
        this._snackBar.open(err.error?.message || 'Ошибка при добавлении комментария');
      }
    });
  }


  private loadUserActions(articleId: string): void {
    this.commentActions = {}; // сбрасываем старые данные
    this.commentService.getArticleCommentActions(articleId).subscribe({
      next: (actions) => {
        actions.forEach(a => {
          this.commentActions[a.comment] = a.action as 'like' | 'dislike';
        });
      },
      error: (err) => console.error('Ошибка при загрузке действий пользователя:', err)
    });
  }

  onAction(commentId: string, action: 'like' | 'dislike' | 'violate'): void {
    this.commentService.applyAction(commentId, action).subscribe({
      next: (res) => {
        if (!res.error) {
          this._snackBar.open(
            action === 'violate' ? 'Жалоба отправлена' : 'Ваш голос учтен'
          );

          if (action === 'like' || action === 'dislike') {
            const currentAction = this.commentActions[commentId];
            const comment = this.comments.find(c => c.id === commentId);
            if (!comment) return;

            if (currentAction === action) {
              this.commentActions[commentId] = null;
              if (action === 'like' && comment.likesCount > 0) comment.likesCount--;
              if (action === 'dislike' && comment.dislikesCount > 0) comment.dislikesCount--;
            } else {
              if (currentAction === 'like' && comment.likesCount > 0) comment.likesCount--;
              if (currentAction === 'dislike' && comment.dislikesCount > 0) comment.dislikesCount--;

              this.commentActions[commentId] = action;
              if (action === 'like') comment.likesCount++;
              if (action === 'dislike') comment.dislikesCount++;
            }
          }
        } else {
          this._snackBar.open(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        const msg = err.error?.message || 'Ошибка при выполнении действия';
        this._snackBar.open(msg);
      }
    });
  }

  get canLoadMore(): boolean {
    return this.comments.length < this.totalComments;
  }

  ngOnDestroy(): void {
    this.loader.hide(1000);
    this.routeSub?.unsubscribe();
    this.authSub?.unsubscribe();
  }
}
