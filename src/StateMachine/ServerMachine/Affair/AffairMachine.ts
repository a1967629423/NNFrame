import * as net from "net"
import * as http from "http";
import {NNStateMachine, AsyncAttachState} from "../../StateMachine"
import AffairState from "./AffairState";
export default class AffairMachine extends NNStateMachine.StateMachine {
    nowState:AffairState|null = null;
    serverInstance:{
        socketServer:net.Server,httpServer:http.Server
    };
    private bindSocketFunc:(...args:any[])=>void
    private bindHttpFunc:(...args:any[])=>void;
    constructor(socketServer:net.Server,httpServer:http.Server)
    {
        super();
        this.serverInstance = {socketServer:socketServer,httpServer:httpServer}
        this.bindHttpFunc = this.disposeHttp.bind(this);
        this.bindSocketFunc = this.disposeSocket.bind(this)
        socketServer.on('request',this.bindSocketFunc);
        httpServer.on("request",this.bindHttpFunc);
    }
    @AsyncAttachState
    disposeSocket(socke:net.Socket,data:Buffer) {
        this.nowState?this.nowState.disposeSocket(socke,data):0;
    }
    @AsyncAttachState
    disposeHttp(req:http.IncomingMessage,res:http.ServerResponse)
    {
        this.nowState?this.nowState.disposeHttp(req,res):0;
    }
    close()
    {
        this.serverInstance.httpServer.off('request',this.bindHttpFunc)
        this.serverInstance.socketServer.off('request',this.bindSocketFunc);
    }
}