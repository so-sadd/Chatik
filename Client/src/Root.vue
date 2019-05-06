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
      <div
        id="current-chatting-user-info"
        v-for="(value, index) in currentChattingUser"
        :key="index"
      >
        <!-- <div id="chat-info-foto">Foto</div> -->
        <div id="current-chatting-user-info-n-s">
          <div id="current-chatting-user-info-name">{{value.name}}</div>
          <div id="current-chatting-user-info-status">{{value.status}}</div>
        </div>
      </div>
    </div>
    <div id="my-body">
      <div id="left-side">
        <div id="search-chat">
          <input type="search" autocomplete="off" value="Поиск..." dir="auto">
        </div>
        <div id="chatting-users" class="scrollbar" v-if="show" key="1">
          <div
            tabindex="-1"
            class="chatting-user"
            v-for="(value, index) in chattingUsers"
            :key="index"
            @click="SelectUserForChatting(false, value.id, value.name)"
          >
            <!-- <div id="chat-info-foto">Foto</div> -->
            <div class="chatting-user-n-s">
              <div class="chatting-user-name">{{value.name}}</div>
              <div class="chatting-user-status">{{value.id}}</div>
            </div>
          </div>
        </div>
        <div id="online-users" class="scrollbar" v-else key="2">
          <div
            class="online-user"
            v-for="(value, index) in onlineUsers"
            :key="index"
            @click="SelectUserForChatting(true, value.id, value.name)"
          >
            <!-- <div id="chat-info-foto">Foto</div> -->
            <div class="online-user-n-s">
              <div class="online-user-name">{{value.name}}</div>
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
                <span class="font-weight-bold">{{ value.sender }}:</span>
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
      currentChattingUser: [],
      chattingUsers: []
    };
  },
  watch: {
    // newMessage() {
    //   socket.emit("typing", inputName);
    //   setTimeout(() => {
    //     socket.emit("stopTyping");
    //   }, 800);
    // }
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

    socket.on("message", data => {
      // this.messages.push({
      //   private: data.private,
      //   sender: data.sender,
      //   reciever: data.reciever,
      //   message: data.message
      // });

      db.chatstore.put({
        room: data.sender,
        msg_from: data.sender,
        msg_to: data.reciever,
        msg_time: new Date(),
        msg: data.message
      });

      db.chatstore.toArray().then(data => {
        this.messages = data;
      });
    });

    socket.on("joined", data => {
      db.online_users.put({ id: data.id, name: data.name });

      db.online_users.toArray().then(data => {
        this.onlineUsers = data;
      });
    });

    socket.on("leave", user_id => {
      db.online_users
        .where("id")
        .equals(user_id)
        .delete();
    });
  },
  mounted() {
    // socket.emit("os-user-name", function(name) {
    //   this.username = name;
    // });

    socket.emit("connected-users", function(data) {
      for (let element in data) {
        db.online_users.put({ id: element, name: data[element] });
      }
    });
  },
  methods: {
    sendMessage() {

      console.log();

      socket.emit("message", {
        private: true,
        sender: this.username,
        reciever: this.currentChattingUser[0].name,
        message: this.newMessage
      });

      // this.messages.push({
      //   private: true,
      //   sender: this.username,
      //   reciever: this.currentChattingUser[0].name,
      //   message: this.newMessage
      // });

      db.chatstore.put({
        room: this.currentChattingUser[0].name,
        msg_from: this.username,
        msg_to: this.currentChattingUser[0].name,
        msg_time: new Date(),
        msg: this.newMessage
      });

      db.online_users.toArray().then(data => {
        this.messages = data;
      });

      this.newMessage = null;
    },

    ShowOnlineUsers() {
      this.show = !this.show;

      db.online_users.toArray().then(data => {
        this.onlineUsers = data;
      });
    },

    SelectUserForChatting(pFromOnlineUsers, pId, pName) {
      if (pFromOnlineUsers) {
        this.show = true;
        db.chatting_users.put({ id: pId, name: pName });

        db.chatstore.toArray().then(data => {
          this.messages = data;
        });
      }

      this.currentChattingUser = [];
      this.currentChattingUser.push({ name: pName, status: pId });

      db.chatting_users.toArray().then(data => {
        this.chattingUsers = data;
      });
    }
  }
};
</script>

<style>
@import "./assets/main.css";
</style>