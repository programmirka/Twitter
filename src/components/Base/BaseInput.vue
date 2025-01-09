<template>
  <label class="inputLabel" :for="uuid" v-if="label"
    >{{ label }} <span class="error" v-if="error">({{ error }})</span></label
  ><br />
  <input
    v-bind="$attrs"
    :placeholder="label"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :id="uuid"
    class="field"
  /><br />
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
<BaseInput 
v-model="user.name" 
label="Name" 
type="text">
</BaseInput>
*/
</script>
<style scoped>
.field {
  padding: 15px 15px 15px 10px;
  margin: 2px 0 13px;
  font-size: 1.1em;
  width: 500px;
  border-radius: 10px;
  border: 0.5px grey solid;
  background-color: rgb(242, 242, 242);
}
.error {
  color: red;
  font-size: 0.9em;
  padding: 1px;
}
.inputLabel {
  font-size: 1.2em;
}
</style>
