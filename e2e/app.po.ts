import { browser, element, by } from 'protractor';

export class Fweb2Page {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('.e-intro-text')).getText();
  }
}
