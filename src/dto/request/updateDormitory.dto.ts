import { IsUUID } from 'class-validator';

export class UpdateDormitoryDto {
  @IsUUID()
  uuid: string;

  name?: string;

  city?: string;

  street?: string;

  postalCode?: string;
}
