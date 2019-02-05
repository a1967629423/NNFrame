import AffairState from "./AffairState";
import AffairMachine from "./AffairMachine";
import AffairState_Http from "./AffairState_Http";
import { LinkTo, StateClass } from "../../StateMachine";

@LinkTo("http",AffairState_Http)
@StateClass(AffairMachine)
export default class AffairState_Socket extends AffairState
{
    
    Start()
    {
        super.Start();
        console.log("socket is run");
    }
}
