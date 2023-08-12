<template>
  <component
    v-for="option in options"
    :key="option.value"
    :is="vertical ? 'div' : 'span'"
    :class="{
      horizontal: !vertical,
    }"
  >
    <BaseRadio
      :label="option.label"
      :value="option.value"
      :modelValue="modelValue"
      :name="name"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </component>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
};
/*
<h3>Are pets allowed?</h3>
<div>
  <BaseRadioGroup
    v-model="event.pets"
    name="pets"
    :options="petOptions"
  />
</div>
<script>
export default {
  data () {
    return {
      categories: [...],
      event: [...],
      petOptions: [
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]
    }
  }
}
*/
</script>
<style scoped>
.horizontal {
  margin-right: 20px;
}
</style>
