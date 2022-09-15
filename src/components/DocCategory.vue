<template>
  <div
    v-if="category"
    :ref="`category-${category.id}`"
    class="docs__content category"
  >
    <div class="docs__info">
      <div class="category__arrow" :class="{ category__arrow_active: open }">
        <img
          :src="require(`@/assets/icons/arrow.svg`)"
          alt="arrow button icon"
        />
      </div>
      <h3 class="category__title">{{ category.title }}</h3>
      <div class="docs__markers" v-if="category.markers.length > 0">
        <div
          v-for="marker in category.markers"
          :key="marker.background"
          class="docs__marker"
          :style="{ background: marker.background }"
          :class="{ docs__marker_outline: marker.outline }"
        ></div>
      </div>
      <span v-if="category.type" class="docs__type">
        {{ category.type }}
      </span>
      <span v-if="category.subtitle" class="docs__subtitle">
        {{ category.subtitle }}
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
  props: ["category", "open", "drop"],
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

        this.$refs[`category-${this.category.id}`].classList.add(
          "docs_dragging"
        );
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

      this.draggableStart = false;
      document.removeEventListener("mousemove", this.dragMove);
      document.removeEventListener("mouseup", this.dragEnd);
      this.$emit("end");

      this.$refs[`category-${this.category.id}`].classList.remove(
        "docs_dragging"
      );
    },
  },
};
</script>

<style lang="scss">
.category {
  padding: 13px 16px;

  &__arrow {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 22px;
    min-width: 22px;
    height: 22px;
    min-height: 22px;
    background: white;
    border: 1px solid #d3d8df;
    border-radius: 50%;

    &_active {
      transform: rotate(180deg);
    }
  }

  &__title {
    margin-left: 14px;
    font-weight: 500;
    font-size: 15px;
    color: black;
  }

  &_insert {
    border-bottom: 5px solid #0066ff;
  }
}
</style>
