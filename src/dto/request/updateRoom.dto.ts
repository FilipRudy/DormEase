import { IsUUID } from 'class-validator';

export class UpdateRoomDto {
  @IsUUID()
  uuid: string;

  size?: number;

  pricePerPerson?: number;

  @IsUUID()
  dormitoryUuid?: string;
}
