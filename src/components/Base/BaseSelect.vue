<template>
  <div class="selectDiv">
    <label :for="uuid" v-if="label">{{ label }}</label>
    <select
      :value="modelValue"
      v-bind="{
        ...$attrs,
        onChange: ($event) => {
          $emit('update:modelValue', $event.target.value);
        },
      }"
      class="field"
      :id="uuid"
    >
      <option
        v-for="option in options"
        :value="option"
        :key="option"
        :selected="option === modelValue"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
import UniqueID from "@/services/UniqueID.js";
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    options: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const uuid = UniqueID().getID();
    return {
      uuid,
    };
  },
};

/* 
<BaseSelect
  :options="categories"
  v-model="event.category"
  label="Select a category"
/>
*/
</script>
<style scoped>
.selectDiv {
  display: flex;
  flex-direction: column;
}
.field {
  /* padding: 10px 10px 20px 10px;
  margin: 8px 0 18px; */
  width: 500px;
  height: 50px;
  margin: 2px 0 13px;
  padding: 15px 15px 15px 10px;
  text-align: center;
  border-radius: 10px;
  border: 0.5px grey solid;
  background-color: rgb(242, 242, 242);
  font-size: 1.1em;
}
</style>
