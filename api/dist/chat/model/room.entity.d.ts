import { UserEntity } from "src/user/model/user.entity";
export declare class RoomEntity {
    id: number;
    name: string;
    description: string;
    users: UserEntity[];
    created_at: Date;
    updated_at: Date;
}
