import NNFrame from './Server';
import AffairMachine from './StateMachine/ServerMachine/Affair/AffairMachine';
import { NNStateMachine } from './StateMachine/StateMachine';
import * as net from 'net';
function testDecorator(v1:string)
{
    return function(target:Function)
    {
        !target.prototype.$v1&&(target.prototype.$v1=v1);
        console.log("Decorator is run");
        console.log(target);
    }
}
function getAllModel()
{
    return function(target:any,prototypeName:string)
    {
        target[prototypeName] = [1,2,3,5];
    }
}
function getMethod()
{
    return function(target:any,prototypeName:string,decorate:any)
    {
        console.log('method')
        console.log(target['constructor']);
    }
}
@testDecorator("test")
class HelloClass{
    @getAllModel()
    public allModel:any;
    @getMethod()
    testFun(value:string)
    {
        this.allModel.push(value);
        console.log(value)
    }
}
//var hello = new HelloClass();
//console.log(hello.allModel)
var app = new NNFrame(3000);