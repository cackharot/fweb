import { Fweb2Page } from './app.po';

describe('fweb2 App', () => {
  let page: Fweb2Page;

  beforeEach(() => {
    page = new Fweb2Page();
  });

  it('should display message saying "Eat better Feel better"', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Eat better Feel better');
  });
});
