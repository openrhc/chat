<template>
  <div class="chat">
    <div class="chat-wrap">
      <div class="head">
        <h1 class="title">011Chat Room</h1>
        <span class="online">当前在线 : {{ Object.keys(users).length }}人</span>
      </div>
      <div class="body">
        <div class="left">
          <ul>
            <!-- <li class="item">
              <img class="img" src="../assets/logo.png" alt="">
              <div class="info">
                <h4>昵称</h4> 
                <span>男 18</span>
              </div>
            </li> -->
            <li v-for="user in users" class="item">
              <img class="img" :src="user.imgurl" alt="">
              <div class="info">
                <h4>{{ user.nickname }}</h4> 
                <span>{{ user.gender ===  1 ? '男' : '女' }}</span>
              </div>
            </li>
          </ul>
          <button @click="getXiaojiejie" class="getImg">给我一张小姐姐ovo</button>
        </div>
        <div class="right">
          <ul ref="history" class="history">

            <li v-for="msg in msgs"
            :class="{other: msg.id != user.id, me: msg.id == user.id}">
            <img v-if="msg.id != user.id" class="img" :src="msg.imgurl" alt=""/>
            <div class="msg">
              <span>{{ msg.nickname }}</span>
              <p v-if="Array.isArray(msg.msg)" class="content">
                <img class="pic" :src="msg.msg" alt="" />
              </p>
              <p v-else class="content">{{ msg.msg }}</p>
            </div>
            <img v-if="msg.id == user.id" class="img" :src="msg.imgurl" alt=""/>
          </li>
        </ul>
        <div class="input-wrap">
          <label class="icon" for="file"></label>
          <input @change="sendImg" id="file" accept="image/*" ref="file" type="file" class="hide"/>
          <input class="edt" type="text" placeholder="说点什么..." autocomplete="off" v-model="content" @keydown="onEnter"/>
          <button class="send" @click="sendMsg">SEND</button>
        </div>
      </div>
    </div>
    <div class="foot">

    </div>
  </div>
</div>
</template>
<script>
  export default{
    name: 'Chat',
    data () {
      return {
        content: ''
      }
    },
    methods: {
      onEnter (e) {
        if (e.keyCode === 13) {
          this.sendMsg();
        }
      },
      getXiaojiejie() {
        this.$emit('getXiaojiejie', '');
      },
      sendMsg () {
        if (this.content.trim().length === 0) {
          return
        }
        this.$emit('sendMsg', this.content);
        this.content = '';
      },
      sendImg () {
        let file = this.$refs.file;
        const that = this;
        if (file.files.length != 0) {
          let img = file.files[0];
          let reader = new FileReader();
          if (!reader) {
            alert('读取失败，你的浏览器不支持');
            return;
          }
          reader.onload = function (e) {
            that.$emit('sendMsg', [e.target.result]);
          }
          reader.readAsDataURL(img);
        }
      }
    },
    props: {
      user: {
        type: Object
      },
      users: {
        type: Object
      },
      msgs: {
        type: Array
      }
    },
    watch: {
      msgs () {
        setTimeout(() => {
          let ul = this.$refs.history;
          ul.scrollTop = ul.scrollHeight;
        }, 10)
      }
    }
  }
</script>
<style scoped>
ul{
  margin: 0;
  padding: 0;
  list-style: none;
  height: 100%;
  overflow: auto;
}
.body .left ul::-webkit-scrollbar {
  width: 4px; 
}
.body .right ul::-webkit-scrollbar {
  width: 8px; 
}
ul::-webkit-scrollbar-track {
  background-color: #fff; 
}
ul::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #eee; 
}

.chat{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../../public/img/bg-main.png);
}
.chat-wrap{
  transform: translate(-50%, -50%);
  position: absolute;
  left: 50%;
  top: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 8px;
  box-shadow: 0 0 18px rgba(0, 0, 0, .25);
}
.head{
  display: flex;
  align-items: center;
}
.head .online{
  margin-left: 16px;
  font-size: 14px;
  font-style: italic;
}
.head .online::before{
  content: ' ';
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: #00ff00;
  border-radius: 50px;
}
.head .title{
  margin-left: 8px;
}
.body{
  display: flex;
  height: 420px;
}
.left{
  width: 200px;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 8px;
}
.left ul{
  flex-grow: 1;
}
.left .getImg{
  outline: none;
  border: none;
  color: #fff;
  line-height: 32px;
  background-color: #e5b9b8;
}
.left .getImg:active{
  outline: none;
  border: none;
  color: #fff;
  line-height: 32px;
  transform-origin: bottom;
  transition: all .2s;
  transform: scaleY(.85);
  background-color: #e5b9b8;
}
.left .item{
  display: flex;
  align-items: center;
  padding: 8px;
  /*background: red;*/
}
.left .item:active{
  background-color: #eee;
}
.left .item .img{
  width: 46px;
  height: 46px;
  background-color: #eee;
  border-radius: 50px;
}
.left .item .info{
  display: flex;
  flex-direction: column;
  padding: 0 8px;
}
.left .item .info h4{
  margin: 4px 0;
}
.left .item .info span{
  font-size: 12px;
}
.right{
  display: flex;
  flex-direction: column;
  width: 500px;
  overflow: auto;
  /*background-color: blue;*/
  border-bottom-right-radius: 8px;
}
.history{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  background-color: #fafcff;
}
.history li{
  padding: 8px;
  /*background: red;*/
  display: flex;
}
.history li .img{
  width: 46px;
  height: 46px;
  border-radius: 50px;
  background-color: #eee;
}
.history li .msg{
  padding: 4px;
}
.history li .pic{
  width: 100%;
}
.history li p{
  word-break: break-all;
  word-wrap: break-word;
  margin: 4px 0;
  padding: 4px 8px;
  border-radius: 8px;
}

.other{

}
.other p{
  background-color: #fff;
}
.me{
  align-self: flex-end;
}
.me .msg{
  text-align: right;
}
.me .msg p{
  color: #fff;
  text-align: left;
  background-color: #99ccff;
}
.input-wrap{
  display: flex;
  align-items: center;
}
.icon{
  outline: none;
  border: none;
  margin-left: 16px;
  /*background-color: red;*/
  background: url('../../public/img/chat.png') no-repeat -161px -16px;
  width: 36px;
  height: 28px;
  transform: scale(.7);
}
.edt{
  flex-grow: 1;
  border: none;
  outline: none;
  padding: 0 16px;
  background-color: transparent;
  line-height: 46px;
}
.send{
  color: #fff;
  height: 100%;
  width: 52px;
  outline: none;
  border: none;
  background-color: #99CCFF;
  border-bottom-right-radius: 8px;
}
.send:hover{
  background-color: #c5def6;
}
.send:active{
  transform: scale(.95, .9);
}

.hide{
  display: none;
  visibility: none;
  height: 0;
  width: 0;
}
</style>
