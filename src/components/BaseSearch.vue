<template>
  <div class="search">
    <BaseInput :text.sync="currentSearch" :options="optionsTextField" />
  </div>
</template>

<script>
import BaseInput from "@/components/BaseInput.vue";

export default {
  props: ["search"],
  components: { BaseInput },
  data() {
    return {
      currentSearch: "",
      optionsTextField: {
        label: "Поиск",
        solo: false,
        readonly: false,
        clearable: true,
        prepend: {
          show: true,
          icon: "mdi-magnify",
        },
      },
    };
  },
  watch: {
    currentSearch() {
      this.$emit("update:search", this.currentSearch || null);
    },
    search() {
      this.currentSearch = this.search;
    },
  },
  beforeMount() {
    this.currentSearch = this.search;
  },
};
</script>

<style lang="scss">
.search {
  width: 564px;

  & > .v-input {
    & > .v-input__control {
      & > .v-input__slot {
        padding: 0 0 12px;

        & > .v-input__prepend-inner {
          margin-top: 5px;
          padding-right: 0;
        }

        &::before {
          border-color: #bfc9e0;
        }
      }
    }
  }
}
</style>
