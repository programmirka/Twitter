<template>
  <div class="modalPlsLogin" @click="close">
    <div class="plsLogin">
      <span @click="close" class="close">&times</span>
      <p>Please log in to perform this action!</p>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style>
.modalPlsLogin {
  position: fixed;
  z-index: 3000;
  top: 0px;
  left: 0px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0px 0px 110%;
}

.plsLogin {
  width: 400px;
  min-height: 100px;
  background-color: aliceblue;
  padding: 17px 70px;
  margin-top: 150px;
  position: relative;
}
/* .close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  top: 0px;
  right: 15px;
}

.close:hover {
  color: black;
  cursor: pointer;
} */
</style>
