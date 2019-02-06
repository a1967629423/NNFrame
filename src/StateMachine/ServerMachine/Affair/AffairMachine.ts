import * as net from "net"
import * as http from "http";
import {NNStateMachine, AsyncAttachState} from "../../StateMachine"
import AffairState from "./AffairState";
export default class AffairMachine extends NNStateMachine.StateMachine {
    nowState:AffairState|null = null;
    constructor()
    {
        super();
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
    
}