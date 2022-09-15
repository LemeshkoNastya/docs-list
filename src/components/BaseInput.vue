<template>
  <v-text-field
    v-model="currentText"
    dense
    :solo="options.solo"
    :label="options.label"
    :readonly="options.readonly"
    :clearable="options.clearable"
    :single-line="!options.solo"
    :prepend-inner-icon="options.prepend.show ? options.prepend.icon : ''"
    color="#0066FF"
    class="input"
  >
    <template v-slot:prepend-inner>
      <img :src="require(`@/assets/icons/search.svg`)" alt="icon search" />
    </template>
  </v-text-field>
</template>

<script>
export default {
  props: ["text", "options"],
  data() {
    return {
      currentText: this.text,
    };
  },
  watch: {
    currentText() {
      this.$emit("update:text", this.currentText);
    },
    text() {
      this.currentText = this.text;
    },
  },
};
</script>

<style lang="scss">
.input {
  margin: 0;

  .v-input__control {
    .v-input__slot {
      margin: 0;

      .v-text-field__slot {
        margin-left: 12px;
        font-weight: 400;
        font-size: 15px;
        color: black;
      }

      .v-label {
        font-weight: 400;
        font-style: italic;
        font-size: 15px;
        color: #8e9cbb;
      }
    }

    .v-input__append-inner {
      .v-input__icon {
        opacity: 1;

        .v-icon {
          color: #ff238d;
        }
      }
    }
  }

  &.v-input--is-focused > .v-input__control > .v-input__slot {
    .v-input__append-inner > .v-input__icon > .v-icon {
      color: #ff238d !important;
    }

    caret-color: black;
  }

  .v-text-field__details {
    display: none;
  }
}
</style>
