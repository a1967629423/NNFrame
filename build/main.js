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
const Server_1 = __importDefault(require("./Server"));
function testDecorator(v1) {
    return function (target) {
        !target.prototype.$v1 && (target.prototype.$v1 = v1);
        console.log("Decorator is run");
        console.log(target);
    };
}
function getAllModel() {
    return function (target, prototypeName) {
        target[prototypeName] = [1, 2, 3, 5];
    };
}
function getMethod() {
    return function (target, prototypeName, decorate) {
        console.log('method');
        console.log(target['constructor']);
    };
}
let HelloClass = class HelloClass {
    testFun(value) {
        this.allModel.push(value);
        console.log(value);
    }
};
__decorate([
    getAllModel()
], HelloClass.prototype, "allModel", void 0);
__decorate([
    getMethod()
], HelloClass.prototype, "testFun", null);
HelloClass = __decorate([
    testDecorator("test")
], HelloClass);
//var hello = new HelloClass();
//console.log(hello.allModel)
var app = new Server_1.default(3000);
//# sourceMappingURL=main.js.map