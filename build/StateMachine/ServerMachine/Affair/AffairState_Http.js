"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AffairState_1 = __importDefault(require("./AffairState"));
const AffairMachine_1 = __importDefault(require("./AffairMachine"));
const StateMachine_1 = require("../../StateMachine");
let AffairState_Http = class AffairState_Http extends AffairState_1.default {
    Start() {
        super.Start();
        console.log("http is run");
    }
    dispose(socket, data) {
        super.dispose(socket, data);
    }
};
AffairState_Http = __decorate([
    StateMachine_1.DefaultState(),
    StateMachine_1.LinkTo("socket", "AffairState_Socket"),
    StateMachine_1.StateClass(AffairMachine_1.default)
], AffairState_Http);
exports.default = AffairState_Http;
//# sourceMappingURL=AffairState_Http.js.map