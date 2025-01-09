<template>
  <label class="textLabel" :for="uuid" v-if="label"
    >{{ label }} <span class="error" v-if="error">({{ error }})</span></label
  ><br />
  <textarea
    v-bind="$attrs"
    :placeholder="label"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :id="uuid"
    class="field"
  ></textarea
  ><br />
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
    error: {
      type: String,
      default: "",
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
  <BaseTextarea
  v-model="user.name" 
  label="Name" 
  type="text">
  </BaseTextarea>
  */
</script>
<style scoped>
.field {
  padding: 15px 15px 15px 10px;
  margin: 2px 0 13px;
  font-family: "Montserrat", sans-serif;
  font-size: 1.1em;
  width: 500px;
  height: 100px;
  border-radius: 10px;
  background-color: rgb(242, 242, 242);
  resize: none;
}
.error {
  color: red;
  font-size: 0.9em;
  padding: 1px;
}
.textLabel {
  font-size: 1.2em;
}
</style>
