"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var defaultWebsocketFactory = function (url, protocol) { return new WebSocket(url, protocol); };
function connect(url, input, protocols, websocketFactory) {
    if (websocketFactory === void 0) { websocketFactory = defaultWebsocketFactory; }
    var connectionStatus = new BehaviorSubject_1.BehaviorSubject(0);
    var messages = new Observable_1.Observable(function (observer) {
        var socket = websocketFactory(url, protocols);
        var inputSubscription;
        var open = false;
        var closed = function () {
            if (!open)
                return;
            connectionStatus.next(connectionStatus.getValue() - 1);
            open = false;
        };
        socket.onopen = function () {
            open = true;
            connectionStatus.next(connectionStatus.getValue() + 1);
            inputSubscription = input.subscribe(function (data) {
                socket.send(data);
            });
        };
        socket.onmessage = function (message) {
            observer.next(message.data);
        };
        socket.onerror = function (error) {
            closed();
            observer.error(error);
        };
        socket.onclose = function (event) {
            closed();
            if (event.wasClean)
                observer.complete();
            else
                observer.error(new Error(event.reason));
        };
        return function () {
            if (inputSubscription)
                inputSubscription.unsubscribe();
            if (socket) {
                closed();
                socket.close();
            }
        };
    });
    return { messages: messages, connectionStatus: connectionStatus };
}
exports.default = connect;
//# sourceMappingURL=index.js.map