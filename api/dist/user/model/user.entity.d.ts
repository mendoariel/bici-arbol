import { RoomEntity } from "src/chat/model/room.entity";
export declare class UserEntity {
    id: number;
    username: string;
    email: string;
    password: string;
    recoveryPasswordToken: string;
    passTokenExpire: string;
    rooms: RoomEntity[];
    emailToLowerCase(): void;
}
