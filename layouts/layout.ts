export interface ILayoutProps {
  children: React.ReactNode;
  frontMatter: {
    title: string;
    description?: string;
    ogImage?: string;
  };
}
