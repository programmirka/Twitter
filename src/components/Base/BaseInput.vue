<template>
  <label :for="uuid" v-if="label"
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
  padding: 10px 10px 20px 10px;
  margin: 8px 0 18px;
  font-size: 1.1em;
  width: 500px;
}
.error {
  color: red;
  font-size: 0.9em;
  padding: 1px;
}
</style>
