export interface IReadingTimeResult {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

export interface IGuideMetadata {
  title: string;
  readingTime: IReadingTimeResult;
  shortTitle?: string;
  description?: string;
  thumbnail?: string;
  ogImage?: string;
}

export interface ILayoutProps {
  children: React.ReactNode;
  frontMatter: IGuideMetadata;
}
