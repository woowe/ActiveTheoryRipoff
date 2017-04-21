import { ActiveTheoryRipoffPage } from './app.po';

describe('active-theory-ripoff App', () => {
  let page: ActiveTheoryRipoffPage;

  beforeEach(() => {
    page = new ActiveTheoryRipoffPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
