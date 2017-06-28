import { PocPage } from './app.po';

describe('poc App', () => {
  let page: PocPage;

  beforeEach(() => {
    page = new PocPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
