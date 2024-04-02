export class Stream {
    private url: string;
    private socket?: WebSocket;
  
    private messageCallbacks: { callback: (payload: any) => void; name: string }[] = [];
    private openCallbacks: (() => void)[] = [];
  
    constructor(endpoint: string) {
      this.url = endpoint;
      this.connect();
    }
  
    public close() {
      this.closeSocket();
    }
  
    public send = (payload: any) => {
      if (this.connected) {
        try {
          this.socket?.send(JSON.stringify(payload));
        } catch (e) {
          throw new Error(`Error sending message: ${(e as Error).message}`);
        }
      } else {
        this.onOpen(() => {
          this.socket?.send(JSON.stringify(payload));
        });
      }
    };
  
    public get connected() {
      return !!(this.socket && this.socket.readyState === WebSocket.OPEN);
    }
  
    public onMessage = (callback: (payload: any) => void, name: string) => {
      this.messageCallbacks.push({ callback, name });
      return () => {
        this.messageCallbacks = this.messageCallbacks.filter((cb) => name !== cb.name);
      };
    };
    public onOpen = (callback: () => void) => {
      this.openCallbacks.push(callback);
    };
    private connect = () => {
      this.socket = new WebSocket(this.url);
      this.socket.onmessage = this.handleMessage;
      this.socket.onopen = this.handleOpen;
    };
  
    private closeSocket = () => {
      this.socket?.close(1000); // Normal close
      this.socket = undefined;
    };
  
    private handleMessage = (ev: MessageEvent) => {
      let data: any;
      try {
        data = JSON.parse(ev.data as string) as any;
      } catch (e) {
        throw new Error(`Error parsing payload: ${(e as Error).message}`);
      }
  
      if (data.ping) {
        this.socket?.send(JSON.stringify({ pong: data.ping }));
      } else {
        this.messageCallbacks.filter((c) => c.name === data.e).forEach((cb) => cb.callback(data));
      }
    };
  
    private handleOpen = () => {
      this.openCallbacks.forEach((cb) => cb());
    };
  }
  
  export const binanceStream = new Stream("wss://stream.binance.com:9443/ws");
  