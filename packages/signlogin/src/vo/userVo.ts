export interface UserDto {
  id: number;
  regTm: number;
  avator?: string;
  account?: string;
  ens?: string;
  nickname?: string;
  summary?: string;
}

export type ChangeUserDto = Partial<Omit<UserDto, 'id' | 'regTm' | 'account'>>;

export class UserVo {
  public constructor(
    public id: number,
    public regTm: number,
    public avator?: string,
    public account?: string,
    public ens?: string,
    public nickname?: string,
    public summary?: string,
  ) {}

  public static fromDto(dto: UserDto) {
    return new UserVo(
      dto.id,
      dto.regTm,
      dto.avator,
      dto.account,
      dto.ens,
      dto.nickname,
      dto.summary,
    );
  }
}
