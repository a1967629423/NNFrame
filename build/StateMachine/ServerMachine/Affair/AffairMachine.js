"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateMachine_1 = require("../../StateMachine");
class AffairMachine extends StateMachine_1.NNStateMachine.StateMachine {
    constructor(socketServer, httpServer) {
        super();
        this.nowState = null;
    }
    disposeSocket(socke, data) {
        this.nowState ? this.nowState.disposeSocket(socke, data) : 0;
    }
    disposeHttp(req, res) {
        this.nowState ? this.nowState.disposeHttp(req, res) : 0;
    }
}
__decorate([
    StateMachine_1.AsyncAttachState
], AffairMachine.prototype, "disposeSocket", null);
__decorate([
    StateMachine_1.AsyncAttachState
], AffairMachine.prototype, "disposeHttp", null);
exports.default = AffairMachine;
//# sourceMappingURL=AffairMachine.js.map