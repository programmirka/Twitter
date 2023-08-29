<template>
  <div class="searchDivBack">
    <p v-if="label">
      {{ label }}
    </p>
    <div class="searchDiv">
      <input
        class="field"
        :placeholder="placeholder"
        v-model="searchTerm"
        @keydown.enter="search"
      />

      <button
        class="replyBtn"
        :disabled="!searchTerm.length"
        @click="search"
        :class="{ disabledButton: !searchTerm.length }"
      >
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        Search
      </button>
    </div>
  </div>

  <div class="searchMessage" v-if="noResults">
    <p>
      Oops! We couldn't find any results for that term. Please try a different
      keyword or phrase.
    </p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchTerm: "",
    };
  },
  emits: ["searchTerms"],
  props: {
    noResults: false,
    placeholder: "",
    label: String,
  },
  methods: {
    search() {
      this.$emit("searchTerms", this.searchTerm);
    },
  },
};
</script>
<style>
.field {
  padding: 15px 10px 20px 10px;
  margin: 8px 0 18px;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1em;
  width: 500px;
  height: 50px;
  resize: none;
  border: 0.5px solid grey;
  border-radius: 20px;
  overflow: hidden;
}
.searchDiv {
  padding: 10px 20px;
  display: flex;
}
.searchDivBack {
  z-index: 100;
  background-color: #f7fbffe9;
  position: fixed;
  width: 100%;
  box-shadow: 37px 10px 20px 35px #f7fbffc5; /* Adjusted box-shadow for subtleness */
}

.searchDivBack p {
  padding: 0 25px;
  font-size: 1.1em;
  font-weight: 200;
  margin: 10px 0px 0px;
  color: #34495e;
}
.replyBtn {
  border-radius: 20px;
  height: 50px;
  width: 110px;
  font-size: 18px;
  font-weight: 400;
  color: white;
  background-color: #6287ad;
  cursor: pointer;
  margin: 8px 10px 18px;
}
.replyBtn:hover {
  height: 55px;
  width: 112px;
}
.disabledButton {
  background-color: #cacaca5e;
  color: rgba(96, 96, 96, 0.566);
  cursor: auto;
}
.disabledButton:hover {
  height: 50px;
  width: 110px;
}
.searchMessage {
  padding: 15px 10px 20px 10px;
  margin: 20px 0 18px;
  font-style: italic;
  color: grey;
  font-weight: 300;
  width: 500px;
  text-align: center;
  position: fixed;
  top: 190px;
}
</style>
