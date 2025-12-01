import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

// Use require for socket.io-client due to module compatibility
const { io } = require('socket.io-client');
type ClientSocket = ReturnType<typeof io>;

describe('EventsGateway Integration Tests', () => {
    let app: INestApplication;
    let client1: ClientSocket;
    let client2: ClientSocket;
    const testRoom = 'test-room-integration';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.listen(3001); // Use different port for testing
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach((done) => {
        // Create two clients for testing collaboration
        client1 = io('http://localhost:3001', {
            transports: ['websocket'],
        });
        client2 = io('http://localhost:3001', {
            transports: ['websocket'],
        });

        let connectedCount = 0;
        const checkBothConnected = () => {
            connectedCount++;
            if (connectedCount === 2) {
                done();
            }
        };

        client1.on('connect', checkBothConnected);
        client2.on('connect', checkBothConnected);
    });

    afterEach(() => {
        client1.disconnect();
        client2.disconnect();
    });

    describe('Room Management', () => {
        it('should allow clients to join a room', (done) => {
            client1.emit('joinRoom', testRoom);
            client1.on('joinedRoom', (data) => {
                expect(data).toBe(testRoom);
                done();
            });
        });

        it('should allow multiple clients to join the same room', (done) => {
            let joinedCount = 0;
            const checkBothJoined = () => {
                joinedCount++;
                if (joinedCount === 2) {
                    done();
                }
            };

            client1.emit('joinRoom', testRoom);
            client2.emit('joinRoom', testRoom);

            client1.on('joinedRoom', checkBothJoined);
            client2.on('joinedRoom', checkBothJoined);
        });
    });

    describe('Real-time Code Collaboration', () => {
        beforeEach((done) => {
            // Both clients join the same room
            let joinedCount = 0;
            const checkBothJoined = () => {
                joinedCount++;
                if (joinedCount === 2) {
                    done();
                }
            };

            client1.emit('joinRoom', testRoom);
            client2.emit('joinRoom', testRoom);

            client1.on('joinedRoom', checkBothJoined);
            client2.on('joinedRoom', checkBothJoined);
        });

        it('should broadcast code changes to other clients in the same room', (done) => {
            const testCode = 'console.log("Hello from integration test");';

            client2.on('codeUpdate', (code: string) => {
                expect(code).toBe(testCode);
                done();
            });

            client1.emit('codeChange', { roomId: testRoom, code: testCode });
        });

        it('should not send code updates to the sender', (done) => {
            const testCode = 'const x = 42;';
            let receivedUpdate = false;

            client1.on('codeUpdate', () => {
                receivedUpdate = true;
            });

            client1.emit('codeChange', { roomId: testRoom, code: testCode });

            // Wait a bit to ensure no update is received
            setTimeout(() => {
                expect(receivedUpdate).toBe(false);
                done();
            }, 100);
        });

        it('should handle multiple rapid code changes', (done) => {
            const updates: string[] = [];
            const expectedUpdates = ['update1', 'update2', 'update3'];

            client2.on('codeUpdate', (code: string) => {
                updates.push(code);
                if (updates.length === expectedUpdates.length) {
                    expect(updates).toEqual(expectedUpdates);
                    done();
                }
            });

            expectedUpdates.forEach((code) => {
                client1.emit('codeChange', { roomId: testRoom, code });
            });
        });
    });

    describe('Language Synchronization', () => {
        beforeEach((done) => {
            let joinedCount = 0;
            const checkBothJoined = () => {
                joinedCount++;
                if (joinedCount === 2) {
                    done();
                }
            };

            client1.emit('joinRoom', testRoom);
            client2.emit('joinRoom', testRoom);

            client1.on('joinedRoom', checkBothJoined);
            client2.on('joinedRoom', checkBothJoined);
        });

        it('should broadcast language changes to other clients', (done) => {
            const newLanguage = 'python';

            client2.on('languageChange', (language: string) => {
                expect(language).toBe(newLanguage);
                done();
            });

            client1.emit('languageChange', { roomId: testRoom, language: newLanguage });
        });
    });

    describe('Code Execution', () => {
        beforeEach((done) => {
            client1.emit('joinRoom', testRoom);
            client1.on('joinedRoom', () => done());
        });

        it('should execute JavaScript code and return output', (done) => {
            const testCode = 'console.log("Test output");';

            client1.on('executionResult', (output: string) => {
                expect(output).toContain('Test output');
                done();
            });

            client1.emit('executeCode', {
                roomId: testRoom,
                language: 'javascript',
                code: testCode,
            });
        }, 10000); // Increase timeout for API call

        it('should broadcast execution results to all clients in the room', (done) => {
            const testCode = 'console.log("Broadcast test");';
            let receivedCount = 0;

            const checkBothReceived = (output: string) => {
                expect(output).toContain('Broadcast test');
                receivedCount++;
                if (receivedCount === 2) {
                    done();
                }
            };

            // Both clients join the room
            client2.emit('joinRoom', testRoom);
            client2.on('joinedRoom', () => {
                client1.on('executionResult', checkBothReceived);
                client2.on('executionResult', checkBothReceived);

                client1.emit('executeCode', {
                    roomId: testRoom,
                    language: 'javascript',
                    code: testCode,
                });
            });
        }, 10000);
    });

    describe('Error Handling', () => {
        it('should handle invalid language gracefully', (done) => {
            client1.emit('joinRoom', testRoom);
            client1.on('joinedRoom', () => {
                client1.on('executionResult', (output: string) => {
                    expect(output).toContain('Error');
                    done();
                });

                client1.emit('executeCode', {
                    roomId: testRoom,
                    language: 'invalid-language',
                    code: 'test',
                });
            });
        }, 10000);
    });
});
