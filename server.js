var http = require('http');
var socket_io = require('socket.io');
var axios = require('axios');

var server = http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write('hello world!');
    res.end();
});
var io = socket_io.listen(server);

server.listen(9090);

// 存放用户
var users = {};
// 存放历史信息
var msgs = [];

// 随机ID
function createRandomId() {
    return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
}

io.on('connection', function (socket) {
    // socket.emit('foo', data);            // 自己
    // socket.broadcast.emit('foo', data);  // 别人
    // io.sockets.emit('foo', data);        // 所有

    
    let userID = '';

    console.log( userID, '已连接，等待登录', '当前在线：', Object.getOwnPropertyNames( users ).length  );

    // 用户登录事件
    socket.on('login', function (user) {

        // 取id 存入用户信息

        if (user.id == '') {
            userID = createRandomId();
        }else{
            userID = user.id;
        }
        user.id = userID;
        users[userID] = user;


        // 通知他登录成功
        socket.emit('loginSuccess', {
            msg: '登录成功',
            user: user,
            users: users
        }); 
        // 向他推送历史消息
        socket.emit('historyMsg', msgs);

        // 通知别人
        socket.broadcast.emit('userChange', {
            users: users
        });

        // 触发发图
        autoSendImg();
        console.log( userID, '已登录', '当前：', Object.keys(users).length );
    })

    // 用户发信息事件
    // 通知所有人，包括自己
    socket.on('sendMsg', function (data) {
        // data: {msg: '', nickname: '', gender: 1, id: 'asdasd'}
        msgs.push(data);
        // 只保存100条记录
        if (msgs.length > 100) {
            msgs = msgs.slice(msgs.length - 100);
        }
        io.sockets.emit('msgChange', data);
    })

    // 手动请求图片
    socket.on('getXiaojiejie', function () {
        autoSendImg();
    })
    // 用户离开
    socket.on('disconnect', function () {
        delete users[userID];
        // 通知别人
        socket.broadcast.emit('userChange', {
            users: users
        });
        console.log( userID, '已离开', '当前在线：', Object.keys(users).length );
    })

})

// 添加发图到用户列表
let fatu = {
    id: 'fatu-xiaojiejie',
    gender: 0,
    nickname: '在线发图-小姐姐',
    imgurl: 'http://cdn.u2.huluxia.com/g3/M01/31/CF/wKgBOVwNZQeASk-KAACG8Ca6vtI193.jpg'
}
users['fatu-xiaojiejie'] = fatu;

/*
    自动发图
*/
function autoSendImg () {
    axios.get('https://acg.lyiqk.cn/purelady?type=json')
    .then( res => {
            // data: {msg: '', nickname: '', gender: 1, id: 'asdasd'}
            let data = {
                msg: [res.data.pic],
                nickname: '在线发图-小姐姐',
                gender: 0,
                id: 'fatu-xiaojiejie',
                imgurl: 'http://cdn.u2.huluxia.com/g3/M01/31/CF/wKgBOVwNZQeASk-KAACG8Ca6vtI193.jpg'
            }
            msgs.push(data);
            io.sockets.emit('msgChange', data);
        })
}
// 自动发图
setInterval(function () {
    autoSendImg();
}, 5 * 60 * 1000) // 5分钟一张

console.log( 'server is running...' );