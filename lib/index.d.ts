import { Observable } from 'rxjs/Observable';
export interface Connection {
    connectionStatus: Observable<number>;
    messages: Observable<string>;
}
export interface IWebSocket {
    close(): any;
    send(data: string | ArrayBuffer | Blob): any;
    onopen?: (OpenEvent) => any;
    onclose?: (CloseEvent) => any;
    onmessage?: (MessageEvent) => any;
    onerror?: (ErrorEvent) => any;
}
export declare type WebSocketFactory = (url: string, protocols?: string | string[]) => IWebSocket;
export default function connect(url: string, input: Observable<string>, protocols?: string | string[], websocketFactory?: WebSocketFactory): Connection;
