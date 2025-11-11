import { ArticleType } from './article.type';
import {CommentType} from "./comment.type";


export type ArticleDetailResponseType = ArticleType & {
  text: string;
  comments: CommentType[];
  commentsCount: number;
};
