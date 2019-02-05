"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const fs = __importStar(require("fs"));
const net = __importStar(require("net"));
const NNTools_1 = require("./Tools/NNTools");
const AffairMachine_1 = __importDefault(require("./StateMachine/ServerMachine/Affair/AffairMachine"));
class RouteCell {
    constructor() {
        this.head = null;
        this.typeArr = [];
        this.type = '';
        this.callback = null;
    }
}
class NNClientConf {
    constructor() {
        this.regPath = '/';
        this.eventPort = 0;
        this.eventHostname = '';
    }
}
class NNServerResult {
    constructor() {
        this.success = false;
        this.message = '';
        this.status = 0;
    }
}
class NNFrame {
    constructor(port = 3000, httpProt = 4000, hostname = 'localhost', homePath = "./htdoc") {
        this.RegRoute = [
            {
                head: val => { return { 'Content-Type': `image/${val}` }; },
                type: 'image',
                typeArr: ['ico', 'png', 'jpg'],
                callback: null
            },
            {
                head: () => { return { 'Content-Type': 'text/html' }; },
                type: 'html',
                typeArr: ['html', 'htm'],
                callback: null
            },
            {
                head: null,
                type: 'text',
                typeArr: ['txt', 'json', 'ini', 'css', 'js'],
                callback: null
            }
        ];
        this.homePath = './htdoc';
        this.httpPort = 0;
        this.port = 0;
        this.hostname = 'localhost';
        this.notFoundPage = `
    <head>
    <meta charset='utf-8'>
    </head>
    <body>
    <h1>404 NOT FOUND!</h1>
    <br><h3>{topic}</h3>
    </body>`;
        this.server = http.createServer();
        let client = new net.Socket();
        client.connect(port, hostname);
        client.setEncoding('utf8');
        this.httpPort = httpProt;
        this.port = port;
        this.hostname = hostname;
        this.AffairPool = new NNTools_1.NNTools.ObjectPool_Auto(AffairMachine_1.default);
        this.AffairPool.InitPool(10);
        client.on('error', err => {
            //主服务不存在，自己就是主服务
            if (err.message.indexOf('connect ECONNREFUSED') > -1) {
                var socketServer = net.createServer(c => {
                    c.setEncoding('utf8');
                    c.on('end', () => {
                        console.log("socket end");
                    });
                    //c.write("hello");
                    c.on('data', this.disposeSocket(c).bind(this));
                });
                socketServer.listen(port, () => {
                    console.log(`socketServer begin listen port:${port}`);
                });
                this.server.listen(httpProt, hostname, () => {
                    console.log(`html Server running at http://${hostname}:${httpProt}`);
                });
                this.server.on('close', () => {
                    console.log('server will be close');
                });
                this.server.on("request", this.disposeReuqest.bind(this));
            }
            let c2 = new net.Socket();
            c2.setEncoding('utf8');
            c2.connect(port, hostname);
            c2.on('data', data => { console.log(data.toString('utf8')); });
            c2.write('csreq');
        });
        client.on('data', val => {
            switch (val.toString('utf8')) {
                case 'welcome':
                    break;
                case 'ok':
                    break;
                case 'allready':
                    break;
            }
        });
        client.write("csreq");
        this.homePath = homePath;
    }
    disposeSocket(c) {
        var _this = this;
        return (function realDisposeSocket(data) {
            if (data.toString('utf8') === 'csreq') {
                c.write('welcome');
                c.removeListener('data', realDisposeSocket);
                c.addListener('data', _this.disposeNode(c).bind(_this));
            }
            else {
                var c1 = new net.Socket();
                c1.connect(_this.httpPort, _this.hostname);
                c1.pipe(c);
                c.pipe(c1);
                c1.write(data);
            }
        });
    }
    disposeNode(c) {
        var status = 0;
        return data => {
            switch (status) {
                case 0:
                    if (data.toString('utf8') === '123') {
                        status++;
                        c.write('ok');
                    }
                    else {
                        c.write('error');
                        c.write('1');
                    }
                    break;
                case 1:
                    try {
                        var conf = JSON.parse(data.toString('utf8'));
                        c.write('allready');
                    }
                    catch (e) {
                        c.write('error');
                        c.write('2');
                    }
                    break;
                default:
                    break;
            }
        };
    }
    disposeReuqest(req, res) {
        this.ResWriteFile(req.url ? req.url : '/', res);
    }
    formatTypeText(type) {
        var reuslt = '';
        var len = type.length;
        type.forEach((value, idx) => {
            reuslt += value;
            if (idx < len - 1) {
                reuslt += '|';
            }
        });
        return reuslt;
    }
    ResWriteFile(path, res) {
        if (path === '/favicon.ico') {
            this.readFileLogic('./favicon.ico', res, 'image', null, () => {
                res.end();
            });
            return;
        }
        path = this.homePath + path;
        fs.stat(path, (err, stat) => {
            if (!err && stat.isDirectory()) {
                path += "index.html";
            }
            console.log(`request: ${path}`);
            var len = this.RegRoute.length;
            for (var key in this.RegRoute) {
                var value = this.RegRoute[key];
                var matchReg = new RegExp(`(?<=(?:\.))(${this.formatTypeText(value.typeArr)})`);
                if (matchReg.test(path)) {
                    let matchType = (path.match(matchReg) || (() => { let nullReg = ['']; nullReg['index'] = -1; return nullReg; })())[0];
                    let TypeIdx = value.typeArr.indexOf(matchType);
                    if (!value.callback) {
                        this.readFileLogic(path, res, value.type, (value.head || (() => { return {}; }))(matchType, TypeIdx, path), () => {
                            res.end();
                        });
                    }
                    else {
                        let callback = value.callback;
                        callback(path, () => {
                            res.end();
                        });
                    }
                    break;
                }
                else if (key == (len - 1).toString()) {
                    if (!res.finished) {
                        this.notFound(res);
                        res.end();
                    }
                }
            }
        });
    }
    readFileLogic(path, res, type, phrase = null, cb = null, notFoundText = "卧槽!具然没找到") {
        fs.readFile(path, (err, data) => {
            if (!err) {
                if (!phrase) {
                    phrase = { 'Content-Type': `${type}/*` };
                }
                res.writeHead(200, phrase);
                res.write(data);
                if (cb)
                    cb();
            }
            else {
                this.notFound(res);
            }
            res.end();
        });
    }
    notFound(res, notFoundText = "卧槽!居然没有找到!!!") {
        res.writeHead(404, { 'Content-Type': 'text/html', 'charset': 'utf-8' });
        res.write(this.notFoundPage.replace('{topic}', notFoundText));
    }
}
exports.default = NNFrame;
//# sourceMappingURL=Server.js.map