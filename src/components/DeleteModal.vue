<template>
  <div class="modalDlt">
    <div class="modal-content">
      <span @click="close" class="close">&times</span>
      <p>Are you sure you want to delete?</p>
      <button @click="yes" class="button">Yes</button>
      <button @click="no" class="button">No</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    close() {
      this.$emit("close");
    },
    yes() {
      this.$emit("yes");
    },
    no() {
      this.$emit("no");
    },
  },
};
</script>
<style scoped>
.modalDlt {
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  text-align: center;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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
.button {
  min-width: 60px;
  height: 32px;
  background-color: aliceblue;
  border: 0.5px solid #6287ad;
}
.button:hover {
  background-color: #6287ad;
}
</style>
