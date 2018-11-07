<template>
  <div class="mdc-form-field" ref="formField">
    <div class="mdc-checkbox" ref="checkbox">
      <input type="checkbox" class="mdc-checkbox__native-control" :id="id" @input="updateValue($event.target.checked)" :required="required"/>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>
    <label :for="id"><slot></slot></label>
  </div>
</template>

<script>

  import {MDCCheckbox} from '@material/checkbox';
  import {MDCFormField} from '@material/form-field';

  export default {
    name: "CheckBox",
    props: {
      value: {
        required: true
      },
      id: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      updateValue(checked) {
        this.$emit('input', checked);
      }
    },
  };
</script>
