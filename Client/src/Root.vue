<template>
  <div id="main">
    <div id="my-head">
      <div id="owner-info">
        <!-- <div id="owner-foto">Foto</div> -->
        <div id="owner-n-s">
          <div id="owner-name">
            <span dir="auto">{{username}}</span>
          </div>
          <div id="owner-status">Owner Status</div>
          <small v-if="typing" style="color:white">{{typing}} is typing</small>
        </div>
        <button @click="ShowOnlineUsers">Toggle</button>
      </div>
      <div id="chat-info" v-for="(value, index) in chattingUser" :key="index">
        <!-- <div id="chat-info-foto">Foto</div> -->
        <div id="chat-info-n-s">
          <div id="chat-info-name">{{value.pName}}</div>
          <div id="chat-info-status">{{value.pStatus}}</div>
        </div>
      </div>
    </div>
    <div id="my-body">
      <div id="left-side">
        <div id="search-chat">
          <input type="search" autocomplete="off" value="Поиск..." dir="auto">
        </div>
        <div id="chatting-users" class="scrollbar" v-if="show" key="1">
          <div class="chatting-user" v-for="(value, index) in chattingUsers" :key="index">
            <!-- <div id="chat-info-foto">Foto</div> -->
            <div class="chatting-user-n-s">
              <div class="chatting-user-name">
                <a href="#">{{value.name}}</a>
              </div>
              <div class="chatting-user-status">{{value.id}}</div>
            </div>
          </div>
        </div>
        <div id="online-users" class="scrollbar" v-else key="2">
          <div class="online-user" v-for="(value, index) in onlineUsers" :key="index">
            <!-- <div id="chat-info-foto">Foto</div> -->
            <div class="online-user-n-s">
              <div class="online-user-name">
                <a href="#" @click="SelectUserForChatting(value.name, value.id)">{{value.name}}</a>
              </div>
              <div class="online-user-status">{{value.id}}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-side">
        <div id="chatting-area" class="scrollbar">
          <!-- <div id="chat-room" v-for="(value, index) in chatrooms" :key="index"> -->
          <div id="chat-room">
            <div v-for="(value, index) in messages" :key="index">
              <p>
                <span class="font-weight-bold">{{ value.user }}:</span>
                {{ value.message }}
              </p>
            </div>
          </div>
        </div>
        <div id="input-text">
          <form @submit.prevent="sendMessage">
            <div>
              <input type="text" v-model="newMessage" placeholder="Новое сообщение...">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import db from "./db.js";

let socket;
let inputName;

export default {
  data() {
    return {
      newMessage: null,
      messages: [],
      users: [],
      typing: false,
      username: null,
      info: [],
      show: true,
      onlineUsers: [],
      chattingUser: [],
      chattingUsers: []
    };
  },
  watch: {
    newMessage() {
      socket.emit("typing", inputName);
      setTimeout(() => {
        socket.emit("stopTyping");
      }, 800);
    }
  },

  created() {
    // console.log("created()");
    this.username = window.prompt("Enter Your User Name");

    socket = io("localhost:1919", { reconnection: false });
    // console.log("localhost:1919");

    socket.emit("joined", this.username);
    // console.log("socket.emit(joined)");

    window.onbeforeunload = () => {
      db.delete();
      socket.emit("leave", socket.id);
    };

    // socket.on("chat-message", data => {
    //   this.messages.push({
    //     message: data.message,
    //     type: 1,
    //     user: data.user
    //   });
    //   var sysdate = new Date();
    //   db.chatstore.put({
    //     chatname: data.user,
    //     msgtime: sysdate,
    //     msg: data.message
    //   });
    // });
    // socket.on("typing", data => {
    //   this.typing = data;
    // });
    // socket.on("stopTyping", () => {
    //   this.typing = false;
    // });

    socket.on("joined", data => {
      db.online_users.put({ id: data.id, name: data.name });

      // console.log("socket.on(joined)" + data.id + ' ' + data.name);
    });

    socket.on("leave", user_id => {
      db.online_users
        .where("id")
        .equals(user_id)
        .delete();

      // console.log("socket.on(leave)");
    });
  },
  mounted() {
    // socket.emit("os-user-name", function(name) {
    //   this.username = name;
    // });
    //console.log("mounted()");
    socket.emit("connected-users", function(data) {
      for (let element in data) {
        db.online_users.put({ id: element, name: data[element] });
      }
    });
    // console.log("connected-users");
  },
  methods: {
    sendMessage() {
      // this.messages.push({
      //   message: this.newMessage,
      //   type: 0,
      //   user: "Me"
      // });
      // socket.emit("chat-message", {
      //   message: this.newMessage,
      //   user: inputName
      // });
      // this.newMessage = null;

      // var sysdate = new Date();
      // db.chatstore.put({
      //   chatname: inputName,
      //   msgtime: sysdate,
      //   msg: this.newMessage
      // });

      this.newMessage = null;
    },

    ShowOnlineUsers() {
      this.show = !this.show;

      db.online_users.toArray().then(data => {
        this.onlineUsers = data;
      });
    },

    SelectUserForChatting(name, id) {
      this.show = true;
      this.chattingUser = [{ pName: name, pStatus: id }];
    }
  }
};
</script>

<style>
@import "./assets/main.css";
</style>