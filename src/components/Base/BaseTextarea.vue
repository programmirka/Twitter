<template>
  <label class="textLabel" :for="uuid" v-if="label"
    >{{ label }} <span class="error" v-if="error"> {{ error }}</span></label
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
  font-size: 1em;
  font-weight: 200;
  width: 500px;
  height: 100px;
  border-radius: 10px;
  border: 0.5px rgba(128, 128, 128, 0.444) solid;
  background-color: rgba(242, 242, 242, 0.706);
  box-shadow: 0px 3px 10px -1px rgba(0, 0, 0, 0.233);
  resize: none;
}
.error {
  font-family: "Montserrat", sans-serif;
  color: rgb(160, 92, 92);
  font-size: 0.8em;
  font-weight: 200;
  padding: 1px;
}
.textLabel {
  font-size: 1.1em;
  font-weight: 400;
}
</style>
