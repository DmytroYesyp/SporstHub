export class ArticleContent {
  title: string;
  description: string;
  text: string;
  publicationDate?: Date;
  alternativeText: string;
  caption: string;
  image: string;
  isPublished: boolean = true;
  leagueId: number;
  teamIds: number[] = [];
}
