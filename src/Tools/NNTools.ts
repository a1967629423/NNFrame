export namespace NNTools
{
    /**
     * 对象池类
     */
    export class ObjectPool<T>{
        private _pool:T[] = [];
        /**
         * 得到一个对象实例，如对象中存在reuse方法则会自动调用对象中的reuse方法
         */
        public get():T|null
        {
            let val:any = this._pool.shift();
            if(val)
            {
                if(val['reuse']&&typeof val['reuse'] === "function")
                {
                    val['reuse']();
                }
                return val;
            }
            return null;
            //return val?val:null;
        }
        /**
         * 回收一个对象，如果对象中存在unuse方法则会自动调用对象中的unuse方法
         * @param obj 对象实例
         */
        public push(obj:T)
        {
            let val:any = obj;
            if(val['unuse']&&typeof val['unuse']==='function')
            {
                val['unuse']();
            }
            this._pool.unshift(obj);
        }
        /**
         * 清空池
         */
        public clear()
        {
                this._pool = [];
        }
    }
    /**
     * 自动构造型对象池
     */
    export class ObjectPool_Auto<T> extends ObjectPool<T>
    {
        private _objectConstructor:{new(...args:any[]):T};
        /**
         * 
         * @param objConstrucor 目标对象的构造函数
         */
        constructor(objConstrucor:{new(...args:any[]):T})
        {
            super();
            this._objectConstructor = objConstrucor;
        }
        /**
         * 用一定数量的实例初始化池
         * @param count 初始化数量
         * @param args 构造函数的参数
         */
        public InitPool(count:number,...args:any[])
        {
            for(var i =0;i<count;i++)
            {
                this.push(new this._objectConstructor(args));
            }
        }
        /**
         * 得到一个对象，如果对象池为空则会自动构造
         */
        public get(...args:any[]):T
        {
            let val = super.get();
            return val?val:new this._objectConstructor(args)
        }
    }
    export class EventEmitter
    {
        static listenerCount(emitter: EventEmitter, event: string | symbol): number
        {
            return 0;
        }
        static defaultMaxListeners: number;

        addListener(event: string | symbol, listener: (...args: any[]) => void): this{
            return this;
        }
        on(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        once(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        prependListener(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        removeListener(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        off(event: string | symbol, listener: (...args: any[]) => void): this
        {
            return this;
        }
        removeAllListeners(event?: string | symbol): this
        {
            return this;
        }
        setMaxListeners(n: number): this
        {
            return this;
        }
        getMaxListeners(): number
        {
            return 0;
        }
        listeners(event: string | symbol): Function[]
        {
            return [];
        }
        rawListeners(event: string | symbol): Function[]
        {
            return [];
        }
        emit(event: string | symbol, ...args: any[]): boolean
        {
            return true;
        }
        eventNames(): Array<string | symbol>
        {
            return [];
        }
        listenerCount(type: string | symbol): number
        {
            return 0;
        }
    }
}