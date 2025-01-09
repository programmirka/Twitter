<template>
  <div class="trend">
    <p v-if="id">
      <RouterLink :to="{ name: 'search', params: { tag: tag_name } }">
        #{{ tag_name }}<br />

        {{ twt_number }} <span v-if="twt_number > 1">tweets</span
        ><span v-else>tweet</span>
      </RouterLink>
    </p>
    <p v-else @click="plsLoginModal">
      #{{ tag_name }}<br />

      {{ twt_number }} <span v-if="twt_number > 1">tweets</span
      ><span v-else>tweet</span>
    </p>
  </div>
</template>
<script>
import { RouterLink } from "vue-router";
import LocalStorage from "../services/LocalStorage";

export default {
  props: {
    tag_name: String,
    twt_number: [String, Number],
    tag_id: [String, Number],
  },
  components: { RouterLink },
  data() {
    return {
      id: LocalStorage.id(),
    };
  },
  methods: {
    plsLoginModal() {
      this.$emit("plsLoginModal");
    },
  },
};
</script>
<style scoped>
.trend {
  width: 80%;
  margin: 5px 5px;
  border-radius: 10px;
  background-color: #6287ad2b;
  padding: 5px 15px;
  color: #34495e;
  height: 80px;
  font-size: 0.7em;
  transition: ease 3s;
}
.trend p {
  margin: 12px;
}
.trend:hover {
  background-color: aliceblue;
  border: 0.5px solid #6287ad;
}
a:hover {
  color: #6287ad;
}
@media screen and (min-width: 1280px) {
  .trend {
    padding: 5px 20px;
    font-size: 0.9em;
    transition: ease 3s;
  }
}
</style>
