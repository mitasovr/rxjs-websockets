"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
require("rxjs");
var TestScheduler_1 = require("rxjs/testing/TestScheduler");
var Observable_1 = require("rxjs/Observable");
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var _1 = require(".");
chai.use(sinonChai);
chai.should();
describe('rxjs-websockets', function () {
    var scheduler;
    var expect;
    var flush;
    var cold;
    var hot;
    beforeEach(function () {
        scheduler = new TestScheduler_1.TestScheduler(chai.assert.deepEqual);
        expect = scheduler.expectObservable.bind(scheduler);
        flush = scheduler.flush.bind(scheduler);
        cold = scheduler.createColdObservable.bind(scheduler);
        hot = scheduler.createHotObservable.bind(scheduler);
    });
    var MockSocket = /** @class */ (function () {
        function MockSocket() {
            this.close = function () { };
        }
        // forwards input as output
        MockSocket.prototype.send = function (data) { this.onmessage({ data: data }); };
        return MockSocket;
    }());
    var connectHelper = function (input, mockSocket, protocols) { return _1.default('url', input, protocols, function () { return mockSocket; }); };
    it('connects to websocket lazily and retrieves data', function () {
        var mockSocket = new MockSocket();
        var _a = connectHelper(hot('abcde|'), mockSocket), connectionStatus = _a.connectionStatus, messages = _a.messages;
        scheduler.schedule(function () { return mockSocket.onopen(); }, 15);
        expect(Observable_1.Observable.of(null).delay(14, scheduler).switchMapTo(messages)).toBe('--cde');
        flush();
    });
    it('ends stream on clean websocket close', function () {
        var mockSocket = new /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.close = sinon.stub();
                return _this;
            }
            return class_1;
        }(MockSocket));
        var _a = connectHelper(cold('a|'), mockSocket), connectionStatus = _a.connectionStatus, messages = _a.messages;
        scheduler.schedule(function () { return mockSocket.onopen(); }, 10);
        scheduler.schedule(function () { return mockSocket.onclose({ wasClean: true }); }, 30);
        expect(messages).toBe('-a-|');
        flush();
        mockSocket.close.should.have.been.calledOnce;
    });
});
//# sourceMappingURL=index.spec.js.map