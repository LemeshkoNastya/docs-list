<template>
  <div class="docs">
    <h2 class="docs__title">Документы</h2>
    <BaseSearch :search.sync="docsSearch" />

    <v-expansion-panels ref="listCategories" accordion class="docs__categories">
      <TransitionGroup name="list">
        <v-expansion-panel
          v-for="(category, indexCategory) in docsCategories"
          :key="category.id"
          @click="indexCategoryActive = indexCategory"
          class="docs__category"
        >
          <v-expansion-panel-header
            v-slot="{ open }"
            class="docs__header"
            :class="{
              docs__header_next: checkCategory(indexCategory),
            }"
          >
            <DocCategory
              :ref="`category-${category.id}`"
              :category="category"
              :open="open"
              @move="dragMoveCategory($event)"
              @end="dragEndCategory($event)"
              @start="currentDrapCategory = category"
            />
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="docs__elements">
              <DocElement
                v-for="element in category.elements"
                :key="element.id"
                :ref="`element-${element.id}`"
                :element="element"
                @move="dragMoveElement($event)"
                @end="dragEndElement($event)"
                @start="currentDrapElement = element"
              />
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </TransitionGroup>
    </v-expansion-panels>

    <div ref="listElements" class="docs__elements">
      <TransitionGroup name="list">
        <DocElement
          v-for="element in docsElements"
          :key="element.id"
          :ref="`element-${element.id}`"
          :element="element"
          @move="dragMoveElement($event)"
          @end="dragEndElement($event)"
          @start="currentDrapElement = element"
        />
      </TransitionGroup>
    </div>

    <span
      v-if="docsCategories.length === 0 && docsElements.length === 0"
      class="docs__error"
    >
      Ничего не найдено. Попробуйте изменить параметры поиска.
    </span>
    <div ref="dragElement" class="docs__drop">
      <DocElement :element="currentDrapElement" :drop="true" />
    </div>
    <div ref="dragCategory" class="docs__drop">
      <DocCategory :category="currentDrapCategory" :drop="true" />
    </div>
  </div>
</template>

<script>
import BaseSearch from "@/components/BaseSearch.vue";
import DocCategory from "@/components/DocCategory.vue";
import DocElement from "@/components/DocElement.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  components: { BaseSearch, DocCategory, DocElement },
  data() {
    return {
      docsSearch: null,
      indexCategoryActive: null,
      currentDrapCategory: null,
      currentDrapElement: null,
      payloadCategories: null,
      payloadElements: null,
    };
  },
  watch: {
    docsSearch() {
      this.changeSearch(this.docsSearch);
      this.changefilterCategories();
      this.changeFilterElements();
    },
  },
  computed: {
    ...mapGetters(["docsCategories", "docsElements"]),
  },
  methods: {
    ...mapMutations([
      "changeSearch",
      "changefilterCategories",
      "changeFilterElements",
      "insertCategory",
    ]),
    ...mapActions(["insertElements"]),
    checkCategory(index) {
      return (
        this.indexCategoryActive !== null &&
        index === this.indexCategoryActive + 1
      );
    },
    dragMoveCategory(e) {
      e = e || window.event;
      e.preventDefault();

      const container = this.$refs.listCategories.$el.getBoundingClientRect();

      this.$refs.dragCategory.hidden = true;
      const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      this.$refs.dragCategory.hidden = false;

      const activeElement =
        this.$refs[`category-${this.currentDrapCategory.id}`];

      this.deleteClassInsert();
      this.payloadCategories = null;

      if (
        elemBelow &&
        activeElement[0].$el !== elemBelow &&
        elemBelow.classList.contains("category")
      ) {
        elemBelow.classList.add("category_insert");
        let idCurrentElement;

        this.docsCategories.forEach((elem) => {
          if (elemBelow === this.$refs[`category-${elem.id}`][0].$el) {
            idCurrentElement = elem.id;
          }
        });

        this.payloadCategories = {
          active: this.currentDrapCategory.id,
          current: idCurrentElement,
        };
      }

      if (
        e.clientY >= container.top &&
        e.clientY <= container.top + container.height
      )
        this.$refs.dragCategory.style.top = e.clientY + "px";
      this.$refs.dragCategory.style.left = "30px";
    },
    dragEndCategory(e) {
      e = e || window.event;
      e.preventDefault();

      if (this.payloadCategories !== null)
        this.insertCategory(this.payloadCategories);

      this.$refs.dragCategory.style.top = "-100vh";
      this.deleteClassInsert();
    },
    dragMoveElement(e) {
      e = e || window.event;
      e.preventDefault();

      const containerCategories =
        this.$refs.listCategories.$el.getBoundingClientRect();
      const containerElements = this.$refs.listElements.getBoundingClientRect();

      this.$refs.dragElement.hidden = true;
      const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      this.$refs.dragElement.hidden = false;

      const activeElement = this.$refs[`element-${this.currentDrapElement.id}`];

      this.deleteClassInsertForElement();
      this.payloadElements = null;

      if (
        elemBelow &&
        activeElement[0].$el &&
        activeElement[0].$el !== elemBelow &&
        elemBelow.classList.contains("element")
      ) {
        elemBelow.classList.add("element_insert");
        let idCurrentElement = null;

        this.docsElements.forEach((elem) => {
          if (elemBelow === this.$refs[`element-${elem.id}`][0].$el) {
            idCurrentElement = elem.id;
          }
        });

        if (idCurrentElement === null) {
          this.docsCategories.forEach((category) => {
            if (category.elements.length > 0) {
              category.elements.forEach((elem) => {
                if (
                  this.$refs[`element-${elem.id}`] &&
                  elemBelow === this.$refs[`element-${elem.id}`][0].$el
                ) {
                  idCurrentElement = elem.id;
                }
              });
            }
          });
        }

        this.payloadElements = {
          active: this.currentDrapElement.id,
          current: idCurrentElement,
        };
      }

      if (
        e.clientY >= containerCategories.top &&
        e.clientY <= containerElements.top + containerElements.height
      )
        this.$refs.dragElement.style.top = e.clientY + "px";
      this.$refs.dragElement.style.left = "30px";
    },
    dragEndElement(e) {
      e = e || window.event;
      e.preventDefault();

      if (this.payloadElements !== null)
        this.insertElements(this.payloadElements);

      this.$refs.dragElement.style.top = "-100vh";
      this.deleteClassInsertForElement();
    },
    deleteClassInsert() {
      const categories =
        this.$refs.listCategories.$el.querySelectorAll(".category");
      if (categories) {
        categories.forEach((category) => {
          if (category.classList.contains("category_insert"))
            category.classList.remove("category_insert");
        });
      }
    },
    deleteClassInsertForElement() {
      const elementsCategories =
        this.$refs.listCategories.$el.querySelectorAll(".element");
      const elements = this.$refs.listElements.querySelectorAll(".element");

      if (elementsCategories) {
        elementsCategories.forEach((element) => {
          if (element.classList.contains("element_insert"))
            element.classList.remove("element_insert");
        });
      }
      if (elements) {
        elements.forEach((element) => {
          if (element.classList.contains("element_insert"))
            element.classList.remove("element_insert");
        });
      }
    },
  },
  mounted() {
    this.changefilterCategories();
    this.changeFilterElements();
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,400;0,500;1,400&display=swap");

.docs {
  margin: 30px;
  font-family: "Fira Sans", sans-serif;

  &_dragging {
    opacity: 0.2;
  }

  &__title {
    margin-top: 3px;
    margin-bottom: 15px;
    font-weight: 500;
    font-size: 22px;
    color: black;
  }

  &__elements {
    margin-top: 14px;
  }

  &__categories {
    margin-top: 18px;
    border-radius: 0;

    & > *:first-child {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      width: 100%;
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    border: 1px solid #dfe4ef;
  }

  &__category {
    width: 100%;
    min-width: 100%;

    &::before {
      border-radius: 0;
      box-shadow: none;
    }

    &:not(:first-child)::after {
      border-top: none;
    }

    &:not(:first-child) {
      .docs__header {
        border-top: 0;

        &_next {
          border: 1px solid #dfe4ef;
        }
      }
    }

    .v-expansion-panel-header__icon {
      display: none;
    }

    .v-expansion-panel-content__wrap {
      padding: 0 0 0 16px;

      .element {
        border-top: 0;

        &:last-child {
          border-bottom: 0;
        }
      }
    }

    &.v-expansion-panel--active > .v-expansion-panel-header {
      min-height: auto;
    }

    &.v-expansion-panel--active + .v-expansion-panel {
      margin-top: 0;
    }

    .docs__elements {
      margin-top: 0;
    }
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  &__info {
    display: flex;
    align-items: center;
  }

  &__markers {
    display: flex;
    margin-left: 16px;
  }

  &__marker {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &:not(:first-child) {
      margin-left: 6px;
    }

    &_outline {
      border: 1px solid #000000;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }

  &__type,
  &__subtitle {
    margin-left: 15px;
    font-weight: 400;
    font-size: 11px;
  }

  &__type {
    color: #ff238d;
  }

  &__subtitle {
    color: #8e9cbb;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 75px;
    max-width: 75px;
    min-width: 75px;
  }

  &__drop {
    position: absolute;
    top: -100vh;
    z-index: 1;
    width: calc(100% - 60px);
    background: white;
    border: 1px solid #dfe4ef;
    box-shadow: 0px 3px 16px rgba(0, 102, 255, 0.7);

    .element {
      border: none;
    }
  }

  &__error {
    color: #8e9cbb;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
