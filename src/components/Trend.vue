<template>
  <div class="trend">
    <p>
      <RouterLink :to="{ name: 'search', params: { tag: tag_name } }">
        #{{ tag_name }}<br />

        {{ twt_number }} <span v-if="twt_number > 1">tweets</span
        ><span v-else>tweet</span>
      </RouterLink>
    </p>
  </div>
</template>
<script>
import { RouterLink } from "vue-router";

export default {
  props: {
    tag_name: String,
    twt_number: [String, Number],
    tag_id: [String, Number],
  },
  components: { RouterLink },
};
</script>
<style scoped>
.trend {
  width: 80%;
  margin: 20px 5px;
  border-radius: 10px;
  background-color: #6287ad2b;
  padding: 5px 20px;
}
.trend p {
  margin: 12px;
}
</style>
