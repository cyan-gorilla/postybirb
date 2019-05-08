import { WebsiteService, WebsiteStatus, SubmissionPostData, PostResult, LoginStatus } from '../interfaces/website-service.interface';
import { Folder } from '../interfaces/folder.interface';
import { Submission } from 'src/app/database/models/submission.model';

export interface UserInformation {
  folders?: Folder[];
}

export class BaseWebsiteService implements WebsiteService {
  BASE_URL: string;
  protected userInformation: Map<string, UserInformation|any> = new Map();

  protected createPostResponse(msg: string, error?: any): PostResult {
    return { msg, error, success: error === undefined, time: (new Date()).toLocaleString() };
  }

  checkStatus(profileId: string): Promise<WebsiteStatus> {
    return Promise.reject({
      username: null,
      status: LoginStatus.LOGGED_OUT
    });
  }

  getFolders(profileId: string): Folder[] {
    throw new Error("Method not implemented.");
  }

  protected formatTags(defaultTags: string[] = [], other: string[] = [], spaceReplacer: string = '_'): any {
    const tags = [...defaultTags, ...other];
    return tags.map((tag) => {
      return tag.trim()
        .replace(/\s/gm, spaceReplacer)
        .replace(/(\/|\\)/gm, spaceReplacer);
    });
  }

  post(submission: Submission, postData: SubmissionPostData): Promise<PostResult> {
    throw new Error("Method not implemented.");
  }

}