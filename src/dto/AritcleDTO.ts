export interface ArticleDTO {
  source: {
    id: string;
    name: string;
  };
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}
