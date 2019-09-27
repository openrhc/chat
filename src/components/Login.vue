<template>
  <div class="login">
    <div class="login-wrap" ref="login">
      <div class="left"></div>
      <div class="right">
        <h1>011 im :)</h1>
        <span>一款多人在线聊天程序</span>
        <input class="nickname" type="text" placeholder="Please enter nickname" autocomplete="off" v-model="nickname" />
        <h3>请选择你的性别</h3>
        <div class="gender">
          <input type="radio" id="male" value="1" name="gender" checked="checked" v-model="gender"/>
          <label for="male" class="male"></label>
          <input type="radio" id="female" value="0" name="gender"  v-model="gender"/>
          <label for="female" class="female"></label>
        </div>

        <button class="join-btn" @click="onJoinClick">JOIN IN{{ loading }}</button>
        <p v-if="connected" class="connected conn">已连接服务器</p>
        <p v-else class="disconnected conn">未连接服务器</p>

        <p class="foot">copyleft 2019 by openrhc@gmail.com</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data () {
      return {
        nickname: '',
        gender: 1,
        id: '',
        imgurl: '',
        loading: ''
      }
    },
    props: ['connected'],
    methods: {
      onJoinClick () {
        if (this.nickname.trim().length < 2) {
          alert('请输入最少2个字符的昵称');
          return;
        }
        (async() => {
          // 获取头像
          if (this.imgurl == '') {
            let gender = this.gender == 1 ? '男' : '女';
            console.log( gender );
            let imgurl = await this.$axios.get(`https://api.uomg.com/api/rand.avatar?sort=${gender}&format=json`)
            .then(res => {
              return res.data.imgurl;
            }).catch(err => {});

            this.imgurl = imgurl;
          }
          
          // 登录
          let timer = setInterval(() => {
            this.loading += '.';
            if (this.loading.length > 3) {
              clearInterval(timer);
              this.$refs.login.style.opacity = '0';
              setTimeout(() => {
              // 触发父组件登录
              if (this.connected) {
                this.$emit('onLoginEvent', {
                  nickname: this.nickname,
                  gender: this.gender,
                  id: this.id,
                  imgurl: this.imgurl
                });
              }else{
                this.loading = '';
                this.$refs.login.style.opacity = '1';
              }
              
            }, 200)
            }
          }, 300)
        })();
      }
    },
    created () {
      try{
        let user = JSON.parse(localStorage.getItem('user'));
        this.id = user.id;
        this.nickname = user.nickname;
        this.gender = user.gender;
        this.imgurl = user.imgurl;
      }catch(e){
        // console.log( e );
      }
    }
  }
</script>

<style scoped>
.login{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url(../../public/img/bg-main.png);
}
.login-wrap{
  transition: all .2s;
  transform: translate(-50%, -50%);
  position: absolute;
  left: 50%;
  top: 50%;
  background: #fff;
  display: flex;
  align-items: stretch;
  border-radius: 8px;
  box-shadow: 0 0 18px rgba(0, 0, 0, .25);
}
.left{
  width: 360px;
  flex-shrink: 0;
  background: url(../../public/img/logo.png) no-repeat;
  background-color: #ffa6a6;
  background-position: center;
}
.right{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  width: 360px;
  height: 400px;
}
h1{
}
span{
  font-size: 12px;
  color: #929292;
}
.nickname{
  width: 100%;
  outline: none;
  line-height: 46px;
  font-size: 16px;
  padding: 0 32px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #f3f3f3;
}
.gender label{
  display: inline-block;
  opacity: .2;
  /*background: red;*/
}
.gender input{
  display: none;
  width: 0;
  height: 0;
  visibility: hidden;
}
.male{
  background: url('../../public/img/chat.png') no-repeat -3px -4px;
  width: 50px;
  height: 49px;
  transform: scale(.8);
}
.female{
  width: 50px;
  height: 50px;
  background: url("../../public/img/chat.png") no-repeat -58px -4px;
  transform: scale(.8);
}
#male:checked + .male{
  opacity: 1;
}
#female:checked + .female{
  opacity: 1;
}
.join-btn{
  width: 100%;
  outline: none;
  border: none;
  margin-top: 16px;
  color: #fff;
  font-size: 16px;
  line-height: 46px;
  background-color: #99CCFF;
  border-radius: 2px;
  transition: all .2s;
}
.join-btn:hover{
  background-color: #c5def6;
}
.join-btn:active{
  transform: scale(.95, .9);
}
.conn{
  font-size: 14px;
}
.conn::before{
  display: inline-block;
  content: '';
  margin-top: 8px;
  margin-right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50px;
}
.connected::before{
  background-color: green;
}
.disconnected::before{
  background-color: red;
}
.foot{
  margin-top: auto;
  font-size: 14px;
  color: #d9d9d9;
}
</style>
