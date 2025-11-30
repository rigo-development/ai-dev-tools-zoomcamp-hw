import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExecutionService } from '../execution/execution.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly executionService: ExecutionService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() roomId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(roomId);
        console.log(`Client ${client.id} joined room ${roomId}`);
        // Ideally we would send the current code in the room here if we stored it.
        // For now, we assume the client will request it or it's a fresh room.
        return { event: 'joinedRoom', data: roomId };
    }

    @SubscribeMessage('codeChange')
    handleCodeChange(
        @MessageBody() data: { roomId: string; code: string },
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`Code change in room ${data.roomId} from client ${client.id}`);
        console.log(`Broadcasting to other clients in room ${data.roomId}`);
        client.to(data.roomId).emit('codeUpdate', data.code);
    }

    @SubscribeMessage('languageChange')
    handleLanguageChange(
        @MessageBody() data: { roomId: string; language: string },
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`Language change in room ${data.roomId} to ${data.language}`);
        client.to(data.roomId).emit('languageChange', data.language);
    }

    @SubscribeMessage('executeCode')
    async handleExecuteCode(
        @MessageBody() data: { roomId: string; language: string; code: string },
        @ConnectedSocket() client: Socket,
    ) {
        const output = await this.executionService.executeCode(data.language, data.code);
        this.server.to(data.roomId).emit('executionResult', output);
    }
}
