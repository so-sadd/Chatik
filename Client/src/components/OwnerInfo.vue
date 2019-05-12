<template>
  <div id="owner-info">
    <div id="owner-info-1">
      <div class="display-flex-dir-row">
        <div id="owner-foto"></div>
        <div class="display-flex-dir-column">
          <div id="owner-name">
            <span dir="auto">{{user_name}}</span>
          </div>
          <div id="owner-status">Статус!</div>
        </div>
      </div>
    </div>
    <ShowOnlineUsersButton/>
  </div>
</template>

<script>
import ShowOnlineUsersButton from "./ShowOnlineUsersButton.vue";

export default {
  components: {
    ShowOnlineUsersButton
  },
  props: ["user_name"],
  methods: {
    ShowOnlineUsers() {
      this.$parent.ShowOnlineUsers();
    }
  }
};
</script>
