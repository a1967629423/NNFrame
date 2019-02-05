import AffairState from "./AffairState";
import AffairMachine from "./AffairMachine";
import { DefaultState, LinkTo, StateClass } from "../../StateMachine";
import * as net from "net";
@DefaultState()
@LinkTo("socket","AffairState_Socket")
@StateClass(AffairMachine)
export default class AffairState_Http extends AffairState
{
    
    Start()
    {
        super.Start();
        console.log("http is run");
    }
    dispose(socket:any,data:any)
    {
        super.dispose(socket,data);
    }
}