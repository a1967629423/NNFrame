import * as net from "net";
import { NNStateMachine } from "../../StateMachine";
import * as http from "http";
export default class AffairState extends NNStateMachine.State
{
    disposeSocket(socke:net.Socket,data:Buffer) {

    }
    disposeHttp(req:http.IncomingMessage,res:http.ServerResponse)
    {

    }
}