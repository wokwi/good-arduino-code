export interface IGuideMetadata {
  title: string;
  shortTitle?: string;
  description?: string;
  thumbnail?: string;
  ogImage?: string;
}

export interface ILayoutProps {
  children: React.ReactNode;
  frontMatter: IGuideMetadata;
}
