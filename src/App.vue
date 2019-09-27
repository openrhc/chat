<template>
  <div id="app">
    <login v-if="!logined" 
    @onLoginEvent="onLoginEvent"
    :connected="this.socket.connected"
    />
    <chat v-if="logined"
    :users="users"
    :user="user"
    :msgs="msgs"
    @sendMsg="sendMsg"
    @getXiaojiejie="getXiaojiejie"
    />
  </div>
</template>

<script>
  import Login from './components/Login.vue'
  import Chat from './components/Chat.vue'

  export default {
    name: 'app',
    data () {
      return{
        socket: null,
        logined: false, // 是否登录
        users: {}, // 存放用户列表
        msgs: [], // 存放历史消息
        user: {} // 当前登录用户信息
      }
    },
    methods: {
      // 用户登录
      onLoginEvent (obj) {
        this.user = obj;
        if (this.socket.connect) {
          this.socket.emit('login', obj);
        }
      },
      // 获取图片
      getXiaojiejie() {
        this.socket.emit('getXiaojiejie', '');
      },
      // 发送消息
      sendMsg (val) {
        let msg;
        if (Array.isArray(val)) {
          // 图片
          msg = Object.assign({msg: val, type: 'img'}, this.user);
        }else{
          msg = Object.assign({msg: val}, this.user);
        }
        this.socket.emit('sendMsg', msg);
      }
    },
    created () {
      this.socket = io('http://192.168.43.86:9090');
      // 用户登录成功时
      this.socket.on('loginSuccess', data => {
        console.log( data );
        localStorage.setItem('user', JSON.stringify(data.user));
        this.logined = true;
        this.user = data.user;
        this.users = data.users;
      })
      // 当用户状态变化时
      this.socket.on('userChange', data => {
        this.users = data.users;
      })
      // 接收历史消息，仅第一次登录时
      this.socket.on('historyMsg', data => {
        this.msgs = data;
      })
      // 当消息改变时
      this.socket.on('msgChange', data => {
        this.msgs.push(data);
      })
    },
    components: {
      Login,
      Chat
    }
  }
</script>

<style>
html, body{
  height: 100%;
  margin: 0;
  user-select: none;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
