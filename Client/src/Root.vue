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
            <!-- <div id="show-online-users" @click="ShowOnlineUsers"></div> -->
            <div id="show-online-users" @click="ShowOnlineUsers">
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  opacity=".55"
                  fill="#263238"
                  d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V21.02l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z"
                ></path>
              </svg>
            </div>
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
            <div id="hide-online-users" @click="ShowOnlineUsers">
              <svg
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="#FFF" d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z"></path>
              </svg>
            </div>

            <div id="hide-online-users-text">Новый чат</div>
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
            <div id="new-group">
              <div id="new-group-icon">
                <svg
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  width="32"
                  height="32"
                >
                  <path
                    fill="#FFF"
                    d="M15.313 15.672c2.401 0 4.237-1.835 4.237-4.235S17.713 7.2 15.313 7.2s-4.235 1.836-4.235 4.237 1.834 4.235 4.235 4.235zm9.349-.64c1.571 0 2.773-1.201 2.773-2.772 0-1.571-1.202-2.773-2.773-2.773s-2.772 1.202-2.772 2.773c0 1.571 1.201 2.772 2.772 2.772zm-1.724 5.841a7.856 7.856 0 0 0-.889-1.107 8.074 8.074 0 0 0-1.825-1.413 9.05 9.05 0 0 0-.675-.346l-.021-.009c-1.107-.502-2.5-.851-4.232-.851-1.732 0-3.124.349-4.232.851l-.112.054a9.247 9.247 0 0 0-.705.374 8.137 8.137 0 0 0-1.705 1.341 7.991 7.991 0 0 0-.656.773 8.584 8.584 0 0 0-.233.334c-.063.095-.116.184-.164.263l-.012.02a4.495 4.495 0 0 0-.213.408v2.276h16.061v-2.276s-.07-.164-.225-.427a4.257 4.257 0 0 0-.162-.265zm1.724-4.357c-1.333 0-2.376.3-3.179.713a9.409 9.409 0 0 1 1.733 1.218c1.402 1.25 1.959 2.503 2.017 2.641l.021.049h4.954v-1.571s-1.294-3.05-5.546-3.05zM9.41 13.78H6.261v-3.152H4.344v3.152H1.2v1.918h3.144v3.145h1.917v-3.145H9.41V13.78z"
                  ></path>
                </svg>
              </div>
              <div id="new-group-text">Новая группа</div>
            </div>
          </div>
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
      <div id="right-side">
        <div id="owner-info" v-for="(value, index) in currentChattingUser" :key="index">
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