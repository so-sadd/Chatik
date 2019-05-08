<template>
  <div id="main">
    <div id="main-1">
      <div id="left-side">
        <div id="left-side-1" v-if="show" key="1">
          <div id="owner-info">
            <div id="owner-info-1">
              <div class="display-flex-dir-row">
                <div id="owner-foto"></div>
                <div class="display-flex-dir-column">
                  <div id="owner-name">
                    <span dir="auto">{{username}}</span>
                  </div>
                  <div id="owner-status">Статус!</div>
                </div>
              </div>
            </div>
            <div id="show-online-users" @click="ShowOnlineUsers"></div>
          </div>
          <div id="search-chat">
            <input
              type="search"
              autocomplete="off"
              title="Поиск или новый чат"
              value="Поиск или новый чат"
              dir="auto"
            >
          </div>
          <div id="chat-list">
            <div
              class="chat"
              :class="[module]"
              tabindex="-1"
              v-for="(value, index) in chattingUsers"
              :key="index"
              @click="SelectUserForChatting(false, value.id, value.name)"
            >
              <div class="display-flex-dir-row">
                <div class="chat-foto"></div>
                <div class="chat-name-status">
                  <div class="chat-name">
                    <span dir="auto">{{value.name}}</span>
                  </div>
                  <div class="chat-status">Статус!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="left-side-2" v-else key="2">
          <div id="hide-online-users-wrapper">
            <div id="hide-online-users" @click="ShowOnlineUsers"></div>
            <div>Новый чат</div>
          </div>
          <div id="search-chat">
            <input
              type="search"
              autocomplete="off"
              title="Поиск или новый чат"
              value="Поиск или новый чат"
              dir="auto"
            >
          </div>
          <div id="online-list">
            <div
              class="chat"
              v-for="(value, index) in onlineUsers"
              :key="index"
              @click="SelectUserForChatting(true, value.id, value.name)"
            >
              <div class="display-flex-dir-row">
                <div class="chat-foto"></div>
                <div class="chat-name-status">
                  <div class="chat-name">
                    <span dir="auto">{{value.name}}</span>
                  </div>
                  <div class="chat-status">{{value.id}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="right-side">
        <div id="chat-info" v-for="(value, index) in currentChattingUser" :key="index">
          <div id="owner-info">
            <div id="owner-info-1">
              <div class="display-flex-dir-row">
                <div id="owner-foto"></div>
                <div class="display-flex-dir-column">
                  <div id="owner-name">
                    <span dir="auto">{{value.name}}</span>
                  </div>
                  <div id="owner-status">{{value.status}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="chatting-area">
          <div id="chat-room">
            <div v-for="(value, index) in messages" :key="index">
              <p>
                <span class="font-weight-bold">{{ value.msg_from }}:</span>
                {{ value.msg }}
              </p>
            </div>
          </div>
        </div>
        <div id="text-input">
          <!-- <div id="text-input-1">
                        <div id="smiles"></div>
                        <div id="text-input-div" contenteditable="true" dir="ltr">Введите сообщение...</div>
                        <div id="smiles"></div>
          </div>-->
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
      chattingUsers: [],
      module_class: "white"
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
  computed: {
    module: {
      get() {
        return this.$style[this.module_class];
      },
      set(new_class) {
        this.module_class = new_class;
      }
    }
  },
  created() {
    this.username = window.prompt("Enter Your User Name");

    socket = io("localhost:1919", { reconnection: false });

    socket.emit("joined", this.username);

    window.onbeforeunload = () => {
      db.delete();
      socket.emit("leave", socket.id);
    };

    this.currentChattingUser.push({ name: null, status: null });

    // socket.on("typing", data => {
    //   this.typing = data;
    // });

    // socket.on("stopTyping", () => {
    //   this.typing = false;
    // });

    socket.on("message", data => {
      db.chatstore.put({
        room: data.sender,
        msg_from: data.sender,
        msg_to: data.reciever,
        msg_time: new Date(),
        msg: data.message
      });

      this.messages = [];
      db.chatstore
        .where("room")
        .equals(this.currentChattingUser[0].name)
        .toArray()
        .then(data => {
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

      this.messages = [];
      db.chatstore
        .where("room")
        .equals(this.currentChattingUser[0].name)
        .toArray()
        .then(data => {
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
      this.module_class = "blue";

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

      this.messages = [];
      db.chatstore
        .where("room")
        .equals(this.currentChattingUser[0].name)
        .toArray()
        .then(data => {
          this.messages = data;
        });
    }
  }
};
</script>

<style>
@import "./assets/main.css";
</style>
<style module>
.blue {
  background-color: #6490b1;
}
.white {
  background-color: white;
}
</style>