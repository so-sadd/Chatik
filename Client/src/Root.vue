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
        <!-- <div>
          <button id="show-modal" @click="showModal = true">New</button>
        </div>-->
      </div>
      <div id="chat-info">
        <!-- <div id="chat-info-foto">Foto</div> -->
        <div id="chat-info-n-s">
          <div id="chat-info-name">Chat Info Name</div>
          <div id="chat-info-status">Chat Info Status</div>
        </div>
      </div>
    </div>
    <div id="my-body">
      <div id="left-side">
        <div id="search-chat">
          <input type="search" autocomplete="off" value="Поиск..." dir="auto">
        </div>
        <div id="chat-list" class="scrollbar">
          <div class="chat" v-for="(value, index) in users" :key="index">
            <!-- <div id="chat-info-foto">Foto</div> -->
            <div id="chat-n-s">
              <div id="chat-name">
                <a
                  href="#"
                  style="display: block;
                          height: 100%;
                          width: 100%;
                          text-decoration: none;"
                >{{value.chatname}}</a>
              </div>
              <div id="chat-status">Chat Status</div>
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
//import Chat from "./components/Chat.vue";
import axios from "axios";
import io from "socket.io-client";
import db from "./db.js";

var socket = io("localhost:1919");
var inputName;

export default {
  // components: {
  //   Chat
  // },
  data() {
    return {
      newMessage: null,
      messages: [],
      users: [],
      typing: false,
      username: null,
      info: []
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
  mounted() {
    inputName = window.prompt("Enter Your User Name");
    this.username = inputName;

    socket.emit("joined", this.username);

    // axios.get("http://localhost:1919/UserName").then(response => {
    //   this.username = response.data;
    // });

    axios.get("http://localhost:1919/ConnectedUsers").then(response => {
      for (element in response.data) {
        //db.chatname.put({ name: element, id: response.data[element] });

        this.users.push({
          chatname: element
        });
      }
    });
  },
  created() {
    window.onbeforeunload = () => {
      socket.emit("leave", inputName);
      db.delete();
    };

    socket.on("chat-message", data => {
      // this.messages.push({
      //   message: data.message,
      //   type: 1,
      //   user: data.user
      // });

      // var sysdate = new Date();
      // db.chatstore.put({
      //   chatname: data.user,
      //   msgtime: sysdate,
      //   msg: data.message
      // });
    });

    socket.on("typing", data => {
      this.typing = data;
    });

    socket.on("stopTyping", () => {
      this.typing = false;
    });

    socket.on("joined", nickname => {
      this.users.push({
        chatname: nickname
      });
      //db.chatname.put({ name: nickname });
    });

    socket.on("leave", nickname => {
      this.users.splice(nickname, 1);

      db.chatname
        .where("name")
        .equals(nickname)
        .delete();
    });
  },
  methods: {
    sendMessage() {
      this.messages.push({
        message: this.newMessage,
        type: 0,
        user: "Me"
      });

      socket.emit("chat-message", {
        message: this.newMessage,
        user: inputName
      });
      this.newMessage = null;

      var sysdate = new Date();
      // db.chatstore.put({
      //   chatname: inputName,
      //   msgtime: sysdate,
      //   msg: this.newMessage
      // });
    }
  }
};
</script>

<style>
@import "./assets/main.css";
</style>