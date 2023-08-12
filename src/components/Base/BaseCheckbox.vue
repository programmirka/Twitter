<template>
  <input type="checkbox" :checked="modelValue" />
  <label v-if="label">{{ label }}</label>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
};
/* <BaseCheckbox
v-model="event.extras.catering"
label="Catering"
/> 

{
    "category" : "",
    "title": "",
    "extras": {
        "catering": true,
        "music": false
    }
}*/
</script>
