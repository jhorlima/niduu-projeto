<template>
  <div class="mdc-text-field mdc-text-field--dense mdc-text-field--outlined mdc-text-field--dense" ref="field">
    <input :type="type" :id="id" class="mdc-text-field__input" :required="required" :value="value"
           @input="updateValue($event.target.value)">
    <label :for="id" class="mdc-floating-label">
      <slot></slot>
    </label>
    <div class="mdc-notched-outline">
      <svg>
        <path class="mdc-notched-outline__path"/>
      </svg>
    </div>
    <div class="mdc-notched-outline__idle"></div>
  </div>
</template>

<script>
  import {MDCTextField} from '@material/textfield';

  export default {
    name: "TextField",
    props: {
      value: {
        required: true
      },
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: "text"
      },
      required: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      updateValue(value) {
        this.$emit('input', value);
      }
    },
    mounted() {
      new MDCTextField(this.$refs.field);
    }
  };
</script>
