export interface UserInfoDto {
  id: number;
  regTm: number;
  avator?: string;
  account?: string;
  ens?: string;
  nickname?: string;
  summary?: string;
}

export type ChangeUserInfoDto = Partial<
  Omit<UserInfoDto, 'id' | 'regTm' | 'account'>
>;

export class UserInfo {
  public constructor(
    public id: number,
    public regTm: number,
    public avator?: string,
    public account?: string,
    public ens?: string,
    public nickname?: string,
    public summary?: string,
  ) {}

  public static fromDto(dto: UserInfoDto) {
    return new UserInfo(
      dto.id,
      dto.regTm,
      dto.avator,
      dto.account,
      dto.ens,
      dto.nickname,
      dto.summary,
    );
  }

  public get toDto(): UserInfoDto {
    return {
      id: this.id,
      regTm: this.regTm,
      avator: this.avator,
      account: this.account,
      ens: this.ens,
      nickname: this.nickname,
      summary: this.summary,
    };
  }
}
