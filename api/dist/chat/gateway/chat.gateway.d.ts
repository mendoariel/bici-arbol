import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user-service/user.service';
import { RoomI } from '../model/room.interface';
import { RoomService } from '../service/room-service/room/room.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private authService;
    private userService;
    private roomService;
    server: Server;
    constructor(authService: AuthService, userService: UserService, roomService: RoomService);
    handleConnection(socket: Socket): Promise<boolean>;
    handleDisconnect(socket: Socket): void;
    private disconnect;
    onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI>;
}
