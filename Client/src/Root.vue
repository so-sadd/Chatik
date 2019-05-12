<template>
  <div id="main">
    <div id="main-1">
      <div id="left-side">
        <div id="left-side-1" v-if="show" key="1">
          <OwnerInfo :user_name="username"/>
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
          <HideOnlineUsersButton/>
          <div id="search-chat">
            <input
              type="search"
              autocomplete="off"
              title="Поиск или новый чат"
              value="Поиск или новый чат"
              dir="auto"
            >
          </div>
          <NewGroupButton/>
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
          <div id="message" v-for="(value, index) in messages" :key="index">
            <!-- <p>
                <span class="font-weight-bold">{{ value.msg_from }}:</span>
                {{ value.msg }}
            </p>-->
            <!-- <div id="triangle"></div> -->
            <p>
              <span v-html="value.msg"></span>
            </p>
          </div>
        </div>

        <div id="text-input">
          <div id="emojis" v-show="showEmojiPicker">
            <div v-for="(value, index) in emojis" :key="index">
              <img
                v-bind:src="value.src"
                @click="addEmoji(value.src)"
                width="30px"
                height="30px"
                alt="Смайлик"
              >
            </div>
          </div>
          <ShowEmojisButton/>
          <div
            @keyup.enter="sendMessage"
            @keydown.enter.prevent
            contenteditable="true"
            id="textarea"
            v-html="textInput"
            @focusout="updateTextInput"
          ></div>
          <div id="attach-file">
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#263238"
                fill-opacity="0.5"
                d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import db from "./db.js";
import push from "push.js";

import HideOnlineUsersButton from "./components/HideOnlineUsersButton.vue";
import ShowEmojisButton from "./components/ShowEmojisButton.vue";
import NewGroupButton from "./components/NewGroupButton.vue";
import OwnerInfo from "./components/OwnerInfo.vue";

let socket;
let inputName;

export default {
  components: {
    HideOnlineUsersButton,
    ShowEmojisButton,
    NewGroupButton,
    OwnerInfo
  },

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
      module_class: "white",
      showEmojiPicker: false,
      textInput: "",
      emojis: [
        { src: require("@/assets/Faces/1.png") },
        { src: require("@/assets/Faces/2.png") },
        { src: require("@/assets/Faces/3.png") },
        { src: require("@/assets/Faces/4.png") },
        { src: require("@/assets/Faces/5.png") },
        { src: require("@/assets/Faces/6.png") },
        { src: require("@/assets/Faces/7.png") },
        { src: require("@/assets/Faces/8.png") },
        { src: require("@/assets/Faces/9.png") },
        { src: require("@/assets/Faces/11.png") },
        { src: require("@/assets/Faces/12.png") },
        { src: require("@/assets/Faces/13.png") },
        { src: require("@/assets/Faces/14.png") },
        { src: require("@/assets/Faces/15.png") },
        { src: require("@/assets/Faces/16.png") },
        { src: require("@/assets/Faces/17.png") },
        { src: require("@/assets/Faces/18.png") },
        { src: require("@/assets/Faces/19.png") },
        { src: require("@/assets/Faces/20.png") },
        { src: require("@/assets/Faces/21.png") },
        { src: require("@/assets/Faces/22.png") },
        { src: require("@/assets/Faces/23.png") },
        { src: require("@/assets/Faces/24.png") },
        { src: require("@/assets/Faces/25.png") },
        { src: require("@/assets/Faces/26.png") }
      ]
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

      this.notify(data.sender, data.message);
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

      db.online_users.toArray().then(data => {
        this.onlineUsers = data;
      });
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
    notify(sender_name, message) {
      push.create(sender_name, {
        body: message,
        icon: "/logo.png",
        timeout: 3000,
        onClick: function() {
          window.focus();
          this.close();
        }
      });
    },
    ShowEmojis() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmoji(ref) {
      this.textInput +=
        "<img src=" + ref + " width='32' height='32' alt='emoji' />";
    },
    updateTextInput: function(e) {
      this.textInput = e.target.innerHTML;
    },
    sendMessage(e) {
      //this.textInput = document.getElementById("textarea").innerHTML;

      this.textInput = e.target.innerHTML;

      socket.emit("message", {
        private: true,
        sender: this.username,
        reciever: this.currentChattingUser[0].name,
        message: this.textInput
      });

      db.chatstore.put({
        room: this.currentChattingUser[0].name,
        msg_from: this.username,
        msg_to: this.currentChattingUser[0].name,
        msg_time: new Date(),
        msg: this.textInput
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

      this.textInput = "";
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