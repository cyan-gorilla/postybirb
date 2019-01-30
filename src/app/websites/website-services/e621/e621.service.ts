import { Injectable } from '@angular/core';
import { WebsiteService, WebsiteStatus, LoginStatus } from '../../interfaces/website-service.interface';
import { HTMLParser } from 'src/app/utils/helpers/html-parser.helper';
import { Website } from '../../decorators/website-decorator';

@Injectable({
  providedIn: 'root'
})
@Website({
  displayedName: 'e621',
  login: {
    url: 'https://e621.net/user/login'
  }
})
export class E621 implements WebsiteService {
  readonly BASE_URL: string = 'https://e621.net';

  constructor() { }

  public async checkStatus(profileId: string): Promise<WebsiteStatus> {
    const returnValue: WebsiteStatus = {
      username: null,
      status: LoginStatus.LOGGED_OUT
    };

    const cookies = await getCookies(profileId, this.BASE_URL);
    const response = await got.get(`${this.BASE_URL}/user/home`, this.BASE_URL, cookies);
    try { // Old legacy code that is marked for refactor
      const body = response.body;
      const matcher = /Logged in as.*"/g;
      const aTags = HTMLParser.getTagsOf(body, 'a');
      if (aTags.length > 0) {
        for (let i = 0; i < aTags.length; i++) {
          let tag = aTags[i];
          if (tag.match(matcher)) {
            returnValue.username = tag.match(/Logged in as.*"/g)[0].split(' ')[3].replace('"', '') || null;
            returnValue.status = LoginStatus.LOGGED_IN;
            break;
          }
        }
      }
    } catch (e) { /* No important error handling */ }

    return returnValue;
  }
}