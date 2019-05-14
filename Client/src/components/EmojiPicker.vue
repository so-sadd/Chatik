<template>
  <div id="emojis" v-show="showEmojiPicker">
    <div v-for="(value, index) in emojis" :key="index">
      <img
        v-bind:src="value.src"
        @click="AddEmoji(value.src)"
        width="30px"
        height="30px"
        alt="Смайлик"
      >
    </div>
  </div>
</template>
<script>
export default {
  props: { showEmojiPicker: Boolean },
  data() {
    return {
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
  methods: {
    AddEmoji(ref) {
      this.$parent.AddEmoji(ref);
    }
  }
};
</script>
