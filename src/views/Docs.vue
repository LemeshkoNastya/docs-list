<template>
  <div class="docs">
    <h2 class="docs__title">Документы</h2>
    <BaseSearch :search.sync="docsSearch" />
  </div>
</template>

<script>
import BaseSearch from "@/components/BaseSearch.vue";

export default {
  components: { BaseSearch },
  data() {
    return {
      docsSearch: null,
    };
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;1,400&display=swap");

.docs {
  margin: 30px;
  font-family: "Fira Sans", sans-serif;

  &__title {
    margin-top: 3px;
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 22px;
    color: black;
  }
}
</style>
