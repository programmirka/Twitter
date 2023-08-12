<template>
  <input
    type="radio"
    :checked="modelValue === value"
    :value="value"
    v-bind="$attrs"
    @change="$emit('update:modelValue', value)"
  />
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
      type: [String, Number],
      default: "",
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
};

/* <h3>Are pets allowed?</h3>
<div>
  <BaseRadio
    v-model="event.pets"
    :value="1"
    label="Yes"
    name="pets"
  />
</div>

<div>
  <BaseRadio
    v-model="event.pets"
    :value="0"
    label="No"
    name="pets"
  />
</div> */
</script>
