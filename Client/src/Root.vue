<template>
  <div id="main">
    <div>
      <p v-for="user in info" v-bind:key="user.id">{{user.username}} {{user.type}}</p>
    </div>

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
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
        </div>
      </div>
      <div id="right-side">
        <div id="chatting-area" class="scrollbar">
          <div v-for="(value, index) in messages" :key="index">
            <p>
              <span class="font-weight-bold">{{ value.user }}:</span>
              {{ value.message }}
            </p>
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
import Chat from "./components/Chat.vue";
import axios from "axios";
import io from "socket.io-client";

var socket = io("localhost:1919");

export default {
  components: {
    Chat
  },
  data() {
    return {
      newMessage: null,
      messages: [],
      ready: false,
      typing: false,
      username: null,
      info: []
    };
  },
  watch: {
    newMessage() {
      socket.emit("typing", this.username);

      setTimeout(() => {
        socket.emit("stopTyping");
      }, 800);
    }
  },
  mounted() {
    this.ready = true;
    socket.emit("joined", this.username);

    axios.get("http://localhost:1919/UserName").then(response => {
      this.username = response.data;
    });
  },
  created() {
    window.onbeforeunload = () => {
      socket.emit("leave", this.username);
    };

    socket.on("chat-message", data => {
      this.messages.push({
        message: data.message,
        type: 1,
        user: data.user
      });
    });

    socket.on("typing", data => {
      this.typing = data;
    });

    socket.on("stopTyping", () => {
      this.typing = false;
    });

    socket.on("joined", data => {
      this.info.push({
        username: data,
        type: "joined"
      });

      setTimeout(() => {
        this.info = [];
      }, 3000);
    });

    socket.on("leave", data => {
      this.info.push({
        username: data,
        type: "left"
      });

      setTimeout(() => {
        this.info = [];
      }, 3000);
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
        user: this.username
      });
      this.newMessage = null;
    }
  }
};
</script>

<style>
@import "./assets/main.css";
</style>