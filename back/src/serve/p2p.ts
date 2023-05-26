import net, { Socket } from "net";
import { MessageData, Payload } from "./network.interface";
import { IBlock } from "@core/block/block.interface";
import Message from "./message";

class P2PNetwork {
  public readonly sockets: Socket[] = [];

  constructor(public readonly message: Message) {}

  // 서버 대기 및 접속
  listen(port: number) {
    const server = net.createServer((socket) => this.handleConnection(socket));
    server.listen(port);
  }
  connect(port: number, host: string) {
    const socket = new net.Socket();
    const connection = () => this.handleConnection(socket);
    socket.connect(port, host, connection);
  }

  // 접속시 메세지 관련 메서드
  broadcast(message: string) {
    // 접속 시 새로운 트랜잭션을 받았다면 담겨있는 모든 소켓(=커넥션 맺어진 소켓들)에게 메세지 날림
    this.sockets.forEach((soket) => soket.write(message));
  }
  handleConnection(socket: Socket) {
    // 접속 시 발동 메서드(메세지 핸들러 포함)
    console.log(
      `+ new connection from ${socket.remoteAddress}:${socket.remotePort}`
    );

    this.sockets.push(socket);
    this.messageHandler(socket);

    // 클라이언트에서 접속시 빈 객체를 던져서 서버의 최신 블럭을 받아옴, 여기서 블럭을 주고 받으면서 최신인지 아닌지 검사한 뒤 싱크를 맞춤
    const message: MessageData = {
      type: "latestBlock",
      payload: {} as IBlock,
    };
    socket.write(JSON.stringify(message));

    // 연결 끊기
    const disconnect = () => this.handleDisconnection(socket);
    socket.on(`close`, disconnect);
    socket.on(`error`, disconnect);
  }
  messageHandler(socket: Socket) {
    const dataFn = (data: Buffer) => {
      const dataToSting = data.toString("utf8");
      try {
        const { type, payload } = JSON.parse(dataToSting);
        // 받은 데이터에 맞는 메세지를 날리기 위해 따로 message 클래스를 만들어서 함수로 받을 수 있도록 처리
        const message = this.message.handler(type, payload);
        if (!message) return;

        socket.write(message);
        /*
        if (type === "receivedTransaction") {
          this.broadcast(message);
        } else {
          if (socket.write(message)) {
            console.log(
              `message: 소켓 버퍼가 가득 차서 드레인 이벤트를 기다리고 있어요.`
            );

            socket.once("drain", () => {
              console.log(`소켓 버퍼가 고갈되어 메세지를 다시 보내요.`);
              dataFn(data);
            });
          }
        }
        */
      } catch (e) {
        let regex = /\{"type":"(.*?)","payload":(\{(.*?)\})?\}/g;
        let matches = [] as MessageData[];
        let match;

        while ((match = regex.exec(dataToSting)) !== null) {
          let type = match[1];
          let payload: Payload = match[3] ? JSON.parse(match[3]) : {};
          matches.push({ type, payload } as MessageData);
        }
        console.log(`result : ${matches[0]}`);
        dataFn(Buffer.from(JSON.stringify(matches[0])));
      }
    };
    socket.on("data", dataFn);
  }
  private handleDisconnection(socket: Socket) {
    // 접속 해제 시 발동 메서드(소켓 배열에서 삭제 포함)
    const index = this.sockets.indexOf(socket);
    if (index === -1) return;
    this.sockets.splice(index, 1);
    console.log(
      `[-] connection from ${socket.remoteAddress}:${socket.remotePort} close`
    );
  }
}

export default P2PNetwork;
