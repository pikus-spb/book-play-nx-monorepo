export function cleanSpaces(text: string): string {
  return text
    .trim()
    .replace(/&nbsp;/gi, ' ')
    .replace(/[ ]{2,}/gi, ' ');
}

export function cleanHTMLAndCopyrights(text: string): string {
  text = cleanSpaces(text).trim();
  if (
    text.startsWith('©') ||
    text.match(/авторские права/gi) ||
    text.match(/создание fb2/gi) ||
    text.match(/Издательство [а-я]+®/gi) ||
    text.match(/Royallib/gi) ||
    text.match(/Все книги автора/gi) ||
    text.match(/Эта же книга в других форматах/gi) ||
    text.match(/Приятного чтения!/gi) ||
    text.match(/Copyright ©/gi) ||
    text.match(/All rights reserved/gi) ||
    text.match(/Все права защищены/gi) ||
    text.match(/litres|литрес/gi)
  ) {
    return '';
  }

  return text;
}
