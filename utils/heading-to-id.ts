export function headingToId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\- ]+/g, '')
    .replace(/\s/g, '-')
    .replace(/-+$/, '');
}
