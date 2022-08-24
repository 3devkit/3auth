export interface UserInfoDto {
  id: number;
  regTm: number;
  avator?: string;
  account?: string;
  ens?: string;
  nickname?: string;
  summary?: string;
  inviteCode?: string;
  twitter?: string;
  discord?: string;
  email?: string;
}

export type ChangeUserInfoDto = Partial<
  Omit<UserInfoDto, 'id' | 'regTm' | 'account'>
>;

export class UserInfo {
  public id: number;
  public regTm: number;
  public avator?: string;
  public account?: string;
  public ens?: string;
  public nickname?: string;
  public summary?: string;
  public inviteCode?: string;
  public twitter?: string;
  public discord?: string;
  public email?: string;

  public constructor(private dto: UserInfoDto) {
    this.id = dto.id;
    this.regTm = dto.regTm;
    this.avator = dto.avator;
    this.account = dto.account;
    this.ens = dto.ens;
    this.nickname = dto.nickname;
    this.summary = dto.summary;
    this.inviteCode = dto.inviteCode;
    this.twitter = dto.twitter;
    this.discord = dto.discord;
    this.email = dto.email;
  }

  public static fromDto(dto: UserInfoDto) {
    return new UserInfo(dto);
  }

  public get shortAccount() {
    return (
      this.account?.substring(0, 6) +
      '...' +
      this.account?.substring(this.account.length - 4)
    );
  }

  public get toDto(): UserInfoDto {
    return this.dto;
  }
}
