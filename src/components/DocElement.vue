<template>
  <div
    v-if="element"
    :ref="`element-${element.id}`"
    class="docs__content element"
  >
    <div class="docs__info">
      <h4 class="element__title">{{ element.title }}</h4>
      <div class="docs__markers" v-if="element.markers.length > 0">
        <div
          v-for="marker in element.markers"
          :key="marker.background"
          class="docs__marker"
          :style="{ background: marker.background }"
          :class="{ docs__marker_outline: marker.outline }"
        ></div>
      </div>
      <span v-if="element.type" class="docs__type">
        {{ element.type }}
      </span>
      <span v-if="element.subtitle" class="docs__subtitle">
        {{ element.subtitle }}
      </span>
    </div>
    <div class="docs__buttons">
      <button
        v-for="button in docsButtons"
        :key="button.name"
        @mousedown.left="dragStart(button.name)"
      >
        <img :src="pathButton(button.name)" :alt="button.alt" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["element", "drop"],
  computed: {
    ...mapGetters(["docsButtons"]),
  },
  methods: {
    pathButton(button) {
      if (button === "moving" && this.drop)
        return require(`@/assets/icons/${button}_active.svg`);
      else return require(`@/assets/icons/${button}.svg`);
    },
    dragStart(button) {
      if (button === "moving") {
        this.$emit("start");

        document.addEventListener("mousemove", this.dragMove);
        document.addEventListener("mouseup", this.dragEnd);

        this.$refs[`element-${this.element.id}`].classList.add("docs_dragging");
      }
    },
    dragMove(e) {
      e = e || window.event;
      e.preventDefault();

      this.$emit("move");
    },
    dragEnd(e) {
      e = e || window.event;
      e.preventDefault();

      document.removeEventListener("mousemove", this.dragMove);
      document.removeEventListener("mouseup", this.dragEnd);
      this.$emit("end");

      this.$refs[`element-${this.element.id}`].classList.remove(
        "docs_dragging"
      );
    },
  },
};
</script>

<style lang="scss">
.element {
  padding: 5px 16px;
  border: 1px solid #dfe4ef;

  &:not(:first-child) {
    border-top: 0;
  }

  &__title {
    font-weight: 400;
    font-size: 13px;
    color: black;
  }

  &_insert {
    border-bottom: 5px solid #0066ff;
  }
}
</style>
