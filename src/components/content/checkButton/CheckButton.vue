<template>
  <div class="checkButton" :class="{check:isChecked}">
    <img src="~assets/img/cart/tick.svg" alt="">
  </div>
</template>

<script>

  export default {
    name: "CheckButton",
    props: {
      isChecked: {
        type: Boolean,
        default() {
          return false
        }
      }
    }
  }
</script>

<style scoped>
  .checkButton {
    border-radius: 50%;
    border: 2px solid #aaaaaa;
  }

  .check {
    background-color: red;
    border-color: red;
  }
</style>
