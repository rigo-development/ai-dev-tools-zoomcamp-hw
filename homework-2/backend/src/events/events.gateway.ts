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
        origin: (requestOrigin, callback) => {
            // Allow all origins by reflecting the request origin
            callback(null, true);
        },
        credentials: true,
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
        console.log(`[CODE_CHANGE] Received from client ${client.id}`);
        console.log(`[CODE_CHANGE] Room: ${data.roomId}`);
        console.log(`[CODE_CHANGE] Code length: ${data.code?.length || 0} chars`);
        console.log(`[CODE_CHANGE] Broadcasting to room ${data.roomId}...`);

        const broadcastResult = client.to(data.roomId).emit('codeUpdate', data.code);
        console.log(`[CODE_CHANGE] Broadcast completed`);

        // Also log room info
        const rooms = Array.from(client.rooms);
        console.log(`[CODE_CHANGE] Client is in rooms:`, rooms);
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
