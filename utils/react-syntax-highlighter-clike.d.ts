// Workaround for missing declaration in @types/react-syntax-highlighter

declare module 'react-syntax-highlighter/dist/cjs/languages/hljs/c-like' {
  const language: any;
  export default language;
}
