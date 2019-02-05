"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NNTools;
(function (NNTools) {
    /**
     * 对象池类
     */
    class ObjectPool {
        constructor() {
            this._pool = [];
        }
        /**
         * 得到一个对象实例，如对象中存在reuse方法则会自动调用对象中的reuse方法
         */
        get() {
            let val = this._pool.shift();
            if (val) {
                if (val['reuse'] && typeof val['reuse'] === "function") {
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
        push(obj) {
            let val = obj;
            if (val['unuse'] && typeof val['unuse'] === 'function') {
                val['unuse']();
            }
            this._pool.unshift(obj);
        }
        /**
         * 清空池
         */
        clear() {
            this._pool = [];
        }
    }
    NNTools.ObjectPool = ObjectPool;
    /**
     * 自动构造型对象池
     */
    class ObjectPool_Auto extends ObjectPool {
        /**
         *
         * @param objConstrucor 目标对象的构造函数
         */
        constructor(objConstrucor) {
            super();
            this._objectConstructor = objConstrucor;
        }
        /**
         * 用一定数量的实例初始化池
         * @param count 初始化数量
         * @param args 构造函数的参数
         */
        InitPool(count, ...args) {
            for (var i = 0; i < count; i++) {
                this.push(new this._objectConstructor(args));
            }
        }
        /**
         * 得到一个对象，如果对象池为空则会自动构造
         */
        get(...args) {
            let val = super.get();
            return val ? val : new this._objectConstructor(args);
        }
    }
    NNTools.ObjectPool_Auto = ObjectPool_Auto;
    class EventEmitter {
        static listenerCount(emitter, event) {
            return 0;
        }
        addListener(event, listener) {
            return this;
        }
        on(event, listener) {
            return this;
        }
        once(event, listener) {
            return this;
        }
        prependListener(event, listener) {
            return this;
        }
        prependOnceListener(event, listener) {
            return this;
        }
        removeListener(event, listener) {
            return this;
        }
        off(event, listener) {
            return this;
        }
        removeAllListeners(event) {
            return this;
        }
        setMaxListeners(n) {
            return this;
        }
        getMaxListeners() {
            return 0;
        }
        listeners(event) {
            return [];
        }
        rawListeners(event) {
            return [];
        }
        emit(event, ...args) {
            return true;
        }
        eventNames() {
            return [];
        }
        listenerCount(type) {
            return 0;
        }
    }
    NNTools.EventEmitter = EventEmitter;
})(NNTools = exports.NNTools || (exports.NNTools = {}));
//# sourceMappingURL=NNTools.js.map