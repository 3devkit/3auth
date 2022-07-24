import { AuthServerAdapter } from '../types';

export class UserRepo {
  public constructor(private authServerAdapter: AuthServerAdapter) {}
}
