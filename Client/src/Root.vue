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
                  <div id="owner-name">{{username}}</div>
                  <div id="owner-status">Статус!</div>
                </div>
              </div>
            </div>
            <div id="show-online-users" @click="ShowOnlineUsers">
              <ShowOnlineUsersSvg/>
            </div>
          </div>
          <div id="search-chat">
            <input type="search" autocomplete="off" placeholder="Поиск...">
          </div>
          <div id="chat-list">
            <div
              class="chat"
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
              <HideOnlineUsersSvg/>
            </div>

            <div id="hide-online-users-text">Новый чат</div>
          </div>
          <div id="search-chat">
            <input type="search" autocomplete="off" placeholder="Поиск...">
          </div>
          <div id="online-list">
            <div id="new-group">
              <div id="new-group-icon">
                <NewGroupSvg/>
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
                <div id="owner-status">Статус!</div>
              </div>
            </div>
          </div>
        </div>
        <div id="chatting-area">
          <div id="message" v-for="(value, index) in messages" :key="index">
            <p>
              <span v-html="value.msg"></span>
            </p>
          </div>
        </div>

        <div id="text-input">
          <EmojiPicker :show-emoji-picker="showEmojiPickerFlag"/>
          <div id="show-emoji" @mousedown.prevent="ShowEmojiPicker">
            <ShowEmojiPickerSvg/>
          </div>
          <div
            id="textarea"
            @keyup.enter="SendMessage"
            @keydown.enter.prevent
            contenteditable="true"
            v-html="textInput"
          ></div>
          <div id="attach-file">
            <AttachNewFileSvg/>
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

//Components
import EmojiPicker from "./components/EmojiPicker.vue";

//SVGs
import ShowOnlineUsersSvg from "./components/svg/ShowOnlineUsersSvg.vue";
import HideOnlineUsersSvg from "./components/svg/HideOnlineUsersSvg.vue";
import NewGroupSvg from "./components/svg/NewGroupSvg.vue";
import ShowEmojiPickerSvg from "./components/svg/ShowEmojiPickerSvg.vue";
import AttachNewFileSvg from "./components/svg/AttachNewFileSvg.vue";

let socket;

export default {
  components: {
    ShowOnlineUsersSvg,
    HideOnlineUsersSvg,
    NewGroupSvg,
    ShowEmojiPickerSvg,
    AttachNewFileSvg,
    EmojiPicker
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
      showEmojiPickerFlag: false,
      textInput: ""
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
  computed: {},
  created() {
    //this.username = window.prompt("Enter Your User Name");

    socket = io("localhost:1919", { reconnection: false });
    // socket.emit("joined", this.username);

    socket.emit("os-user-name", name => {
      this.username = name;

      socket.emit("joined", this.username);
    });

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

      this.Notify(data.sender, data.message);
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
    socket.emit("connected-users", function(data) {
      for (let element in data) {
        db.online_users.put({ id: element, name: data[element] });
      }
    });
  },
  methods: {
    Notify(sender_name, message) {
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
    ShowEmojiPicker() {
      this.showEmojiPickerFlag = !this.showEmojiPickerFlag;
    },
    AddEmoji(ref) {
      this.textInput += "<img src=" + ref + " width='30' height='30' /> ";
    },
    SendMessage(e) {
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

      e.target.innerHTML = "";
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
