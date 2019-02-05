
/**
 * 载入目录下的所有脚本，用于实现状态初始化
 * 注：此方法使用的了fs模块，不适用于网页js
 * @param path 相对路径
 * @param localPath 当前路径
 */
function RequireAll(path: string,localPath:string) {
    var fs = require('fs'); //导入fs模块
    var ap =getAbsolutePath(path,localPath)
    var files = fs.readdirSync(ap)
    for (var value of files) {
        var reg = /(?<=(?:\.))\w+$/;
        if (reg.test(value)) {
            
            var match = value.match(reg);
            match ? match[0] === "js" ? require(ap+ value) : undefined : undefined;
        }else
        {
            if(fs.statSync(ap+value+'\\').isDirectory())
            {
                RequireAll(ap+value+"\\",localPath);
            }
        }
    } 
}
function getAbsolutePath(relativePath:string,localPath:string):string
{
    var ap = relativePath.replace("./",localPath+"/");
    var reg1 = /\.\.\//;
    var reg2 = /(\.\.\/)+/;
    var reg3 = /(\/|\\)[^\\ ^\/)]+/g;
    if(reg1.test(ap))
    {
        var match = ap.match(reg1);
        var count = match?match.length:0;//得到../的数量
        var match1 = localPath.match(reg3);//将路径分开
        var len = match1?match1.length:0;
        var rp = '';
        for(var i =0;i<len-count;i++)
        {
            rp+=match1?match1[i]:'';//将../数减去路径数然后拼合成最后的路径
        }
        //将所有的../替换成绝对路径
        ap = ap.replace(reg2,localPath.replace(reg3,"")+rp+"/");

    }
    return ap;
}
var __loadStatus = false;
/**
 * 标识一个类为状态机状态类
 * @param Machine 所作用的状态机
 */
export function StateClass<T extends NNStateMachine.StateMachine>(Machine: { prototype: T }) {
    return (target: { new(arg:NNStateMachine.StateMachine):NNStateMachine.State, [key: string]: any, prototype: NNStateMachine.State, call: Function }) => {
        var cell = NNStateMachine.DB.find(value => {
            return value.Machine === Machine;
        });
        if (cell) {
            if (!cell.States.find(value=>{return value.name===target.name})) {
                cell.States.push(target);
            }
            else {
                console.error("重复的状态 "+target.name)
            }
        }
        else {

            cell = {
                Machine: Machine,
                States: [target]
            };
            NNStateMachine.DB.push(cell);
        }
        target['__Machine'] = Machine;
    }
}
/**
 * 将此状态与目标状态通过事件连接
 * @param eventName 触发状态切换的事件
 * @param target 目标状态
 */
export function LinkTo<T extends NNStateMachine.State>(eventName: string, target: { prototype: T }|string) {
    return (source: { [key: string]: any, prototype: T }) => {
        if(!disLinkTo(source,eventName,target))
        {
            NNStateMachine.EventDB.push(()=>{
                if(!disLinkTo(source,eventName,target))
                {
                    console.error("状态类需要指定StateClass 类名:"+source['name']);
                }
            })
        }

    }
}
function disLinkTo<T extends NNStateMachine.State>(source: { [key: string]: any, prototype: T },eventName: string, target: { prototype: T }|string):boolean
{
    if(source['__Machine'])
        {
            var cell = NNStateMachine.LinkDB.find(value => {
                return value.Machine === source['__Machine'];
            });
            if (cell) {
                cell.StateMap.push({
                    State: source,
                    Target: target,
                    eventName: eventName
                });
            }
            else {
                NNStateMachine.LinkDB.push({
                    Machine: source['__Machine'],
                    StateMap: [{
                        State: source,
                        Target: target,
                        eventName: eventName
                    }]
                });
            }
            return true;
        }
        else
        return false;
}
/**
 * 设置为默认状态，默认状态只能存在一个
 */
export function DefaultState<T extends NNStateMachine.State>()
{
    return (target:{[key:string]:any,prototype:T})=>{
        if(!disDefaultState(target))
        {
            NNStateMachine.EventDB.push(()=>{
                if(!disDefaultState(target))
                {
                    console.error("状态类需要指定StateClass 类名:"+target['name'])
                }
            })
        }
    }
}
function disDefaultState<T extends NNStateMachine.State>(target:{[key:string]:any,prototype:T})
{
    var machine = target['__Machine'];
    if(machine)
    {
        var cell = NNStateMachine.DefaultDB.find(value=>{
            return value.Default===machine
        });
        if(!cell)
        {
            NNStateMachine.DefaultDB.push({
                Machine:machine,
                Default:target
            });
        }
        else
        {
            console.info("存在两个默认状态 1:"+cell.Default['name']+" 2:"+target['name']);
        }
        return true;
    }
    else
    return false;
}
/**
 *更新附加状态，注意，需要参数中包含OperatorStruct且是最后一个参数
 */
export function AsyncAttachState(target:any,methodName:string,de:any)
{
    var oldMethod = target[methodName];//保存原函数
    target[methodName] = function(...arg: any[])
    {
        var op = arg.pop()//取出在最后的OperatorStruct
        if(op instanceof NNStateMachine.OperatorStruct)
        {
            target['forEachAttach'](methodName,op,arg);
            oldMethod();
            op.destroy();
        }
        else
        oldMethod(); 
    }
}
export  module NNStateMachine {
    export class DBClass {
        Machine: { prototype: NNStateMachine.StateMachine };
        States: {new(arg:StateMachine):State,  prototype: NNStateMachine.State, call: Function }[];
        constructor(Machine: { prototype: NNStateMachine.StateMachine }, States: {new(arg:StateMachine):State,  prototype: NNStateMachine.State, call: Function }[]) {
            this.Machine = Machine;
            this.States = States;
        }
    }
    export class LinkDBClass
    {
        Machine:{prototype:StateMachine};
        StateMap:{State:{prototype:State},Target:{prototype:State}|string,eventName:string}[];
        constructor(Machine:{prototype:StateMachine},StateMap:{State:{prototype:State},Target:{prototype:State}|string,eventName:string}[])
        {
            this.Machine = Machine;
            this.StateMap = StateMap;
        }
    }
    export class DefaultDBClass
    {
        Machine:{prototype:StateMachine};
        Default:{[key:string]:any,prototype:State};
        constructor(Machine:{prototype:StateMachine},Default:{prototype:State})
        {
            this.Machine = Machine;
            this.Default = Default;
        }
    }
    export var DB: DBClass[] = [];
    export var LinkDB: LinkDBClass[] = [];
    export var DefaultDB:DefaultDBClass[] = [];
    export var EventDB:Function[] = [];
    /**
     * 手动操作，需要将所有状态类都进行初始化
     */
    export var handOp:boolean = false;
    /**
     * 初始化状态机，将对应的状态初始化后载入状态机
     * @param instance 状态机实例
     */
    export function InitStates<T extends NNStateMachine.StateMachine>(instance: T) {
        if(!__loadStatus&&!handOp){RequireAll("./",__dirname);__loadStatus = !__loadStatus}
        EventDB.forEach(value=>{value();});
        EventDB = [];
        var target = instance['constructor'];
        var cell = NNStateMachine.DB.find(value => {
            return value.Machine === target;
        });
        var linkCell = LinkDB.find(value=>{
            return value.Machine === target;
        });
        var defaultCell = DefaultDB.find(value=>{
            return value.Machine===target;
        })
        if (cell) {
            for (var ste of cell.States) {
                var state: NNStateMachine.State = new ste(instance);
                instance.stateDB.push({ state: state, idx: instance.stateMap.push([])-1 }); 
            }
            if(linkCell)
            {
                for(var val of linkCell['StateMap'])
                {
                    var sp = val.State;
                    var tp:any;
                    if(typeof val.Target === "string")
                    {
                        let c = instance.stateDB.find(value=>{ 
                            return value.state['constructor']['name']===val.Target
                        });
                        tp = c?c.state['constructor']:null;
                    }
                    else
                    tp = val.Target;
                    
                    var s = instance.stateDB.find(value=>{
                        return value.state['constructor']===sp;
                    });
                    var t = instance.stateDB.find(value=>{
                        return value.state['constructor']===tp;
                    });
                    t&&s?instance.stateMap[s.idx].push({eventName:val.eventName,target:t.state}):undefined;
                }

            }
            if(defaultCell)
            {
                var sd = instance.stateDB.find(value=>{
                    return defaultCell?value.state['constructor']===defaultCell.Default:false;
                });
                sd?instance.changeState(sd.state):undefined;

            }
        }
    }
    /**
     * 操作结构类
     * 自带对象池，用完需要调用destroy进行对象回收
     */
    export class OperatorStruct
    {
        public canOperator:boolean = true;
        public operatorInformation:any = Object.create(null);
        public static cachesOperator:OperatorStruct[] = [];
        public static getinstance():OperatorStruct
        {
            
            let op = OperatorStruct.cachesOperator.length>0?OperatorStruct.cachesOperator.shift():undefined;
            op = op?op:new OperatorStruct();
            return op;
        }
        destroy()
        {
            this.canOperator = true;
            this.operatorInformation = Object.create(null);
            OperatorStruct.cachesOperator.unshift(this);
        }
    }
    export  class State  {
        [key:string]:any;
        quitEvent:Function|null = null;
        context:StateMachine;
        constructor(cxt:StateMachine)
        {
            this.context = cxt;
        }
        Start () {
    
        }
        update(dt:number,op:OperatorStruct)
        {
    
        }
        Quit()
        {
            if(this.quitEvent)this.quitEvent(this);
        }
    }
    export class StateMachine {
        [key: string]: any;
        nowState: State | null = null
        attachment: { ch: State[], construct: { prototype: State } }[] = [];
        stateMap: { eventName: string, target: State }[][] = [];
        stateDB: { state: State, idx: number }[] = [];
        sqs: State[] = [];
        /**
         * 切换当前状态
         * @param cs 状态实例
         */
        changeState(cs: State) {
            if (this.nowState) this.nowState.Quit();
            this.nowState = cs;
            cs.Start();
        }
        constructor() {
            InitStates(this);
        }
        connect(s1: State, s2: State, eventName: string) {
            var DB: { state: State, idx: number } = {
                state: s1,
                idx: this.stateMap.push([{ eventName: eventName, target: s2 }])
            }
        }
        /**
         * 引起一个事件
         * @param eventName 事件名
         */
        emit(eventName: string) {
            if (this.nowState) {
                this.stateDB.forEach(value => {
                    if (value.state === this.nowState) {
                        this.stateMap[value.idx].forEach(block => {
                            if (block.eventName === eventName) {
                                this.changeState(block.target);
                            }
                        })
                    }
                })
            }
        }
        /**
         * 附加一个状态在状态机上，附加状态独立于普通状态，附加状态会在普通状态之前被调用，只能通过移除的方式来退出而不是切换
         * @param type 状态类
         */
        attachState<T extends State>(type: { prototype: T, apply: Function }): T {
            //创建实例
            var cs: T = type.apply({ __proto__: type.prototype }, [this])
            cs.quitEvent = this.attachQuit.bind(this);
            var fch = this.attachment.find((value) => {
                if (value.construct === type) return true;
                else return false;
            });
            if (fch) {
                fch.ch.push(cs);
            }
            else {
                this.attachment.push({ ch: new Array(cs), construct: type });
            }
            this.sqs.push(cs);
            setTimeout(() => {
                cs.Start();
            })
            return cs;
        }
        attachQuit(CS: State) {
            var chindex = 0;
            let index = this.attachment.findIndex((value) => {
                return value.ch.find((v2, index: number) => {
                    if (v2 === CS) {
                        chindex = index;
                        return true;
                    }
                    else
                        return false;
                })?true:false;

            });
            let index2 = this.sqs.findIndex((value: State) => {
                return value === CS;
            });
            this.attachment[index].ch.splice(chindex, 1);
            this.sqs.splice(index2, 1);
            if (this.attachment[index].ch.length < 1) delete this.attachment[index];
        }
        /**
         * 获取所有附加状态
         * @param type 状态类
         */
        getAttachs<T extends State>(type: { prototype: T, apply: Function }): T[] | null {
            for (let val in this.attachment) {
                if (this.attachment[val].construct === type) return <T[]>this.attachment[val].ch;
            }
            return null;
        }
        /**
         * 获取附加状态（如有多个相同状态此方法只会返回状态链表的第一个状态）
         * @param type 状态类
         */
        getAttach<T extends State>(type: { prototype: T, apply: Function }): T {
            let ats = this.getAttachs(type);
            return <T>(ats ? ats[0] : ats);
        }


        forEachAttach(functionName: string, os: OperatorStruct, ...arg: any[]) {
            if (this.sqs.length > 0) {
                for (var i = this.sqs.length - 1; i >= 0; i--) {
                    arg.push(os);
                    this.sqs[i][functionName].apply(this.sqs[i], arg);
                }
            }
        }
        /**
         * 修改一个附加状态的执行顺序
         */
        changAttachStateOrder(cs: State, order: number) {
            var idx = this.sqs.findIndex((value) => { return value === cs });
            var newArr = this.sqs.splice(idx, 1);
            newArr.splice(order, 0, this.sqs[idx]);
            this.sqs = newArr;
        }
        getStatesLength(): number {
            return this.sqs.length;
        }

    }
}

