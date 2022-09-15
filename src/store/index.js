import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    categories: [{
        id: 0,
        title: "Обязательные для всех",
        subtitle: "Документы, обязательные для всех сотрудников без исключения",
        markers: [{
            background: "#FF238D",
            outline: false
          },
          {
            background: "#FFB800",
            outline: false
          },
          {
            background: "#FF8D23",
            outline: true
          },
        ],
        type: null,
        elements: [{
            id: 0,
            title: "Паспорт",
            subtitle: "Для всех",
            markers: [{
              background: "#00C2FF",
              outline: false
            }],
            type: "Обязательный",
          },
          {
            id: 1,
            title: "ИНН",
            subtitle: "Для всех",
            markers: [],
            type: "Обязательный",
          },
        ],
      },
      {
        id: 1,
        title: "Обязательные для трудоустройства",
        subtitle: "Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от граж",
        markers: [],
        type: null,
        elements: [],
      },
      {
        id: 2,
        title: "Специальные",
        subtitle: null,
        markers: [],
        type: null,
        elements: [],
      },
    ],
    elements: [{
        id: 2,
        title: "Тестовое задание кандидата",
        subtitle: "Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха",
        markers: [],
        type: null,
      },
      {
        id: 3,
        title: "Трудовой договор",
        subtitle: null,
        markers: [{
            background: "#0066FF",
            outline: false
          },
          {
            background: "#8E9CBB",
            outline: false
          }
        ],
        type: null,
      },
      {
        id: 4,
        title: "Мед. книжка",
        subtitle: null,
        markers: [],
        type: null,
      },
    ],
    buttons: [{
        name: "edit",
        alt: "edit button icon"
      },
      {
        name: "delete",
        alt: "delete button icon"
      },
      {
        name: "moving",
        alt: "moving button icon"
      },
    ],
    search: null,
    filterCategories: [],
    filterElements: [],
    activeElement: null,
    currentElement: null,
  },
  mutations: {
    changeSearch(state, text) {
      state.search = text;
    },
    changefilterCategories(state) {
      let copyCategories = state.categories.slice();

      if (state.search !== null) {
        copyCategories = copyCategories.filter(
          (doc) =>
          doc.title.toLowerCase().indexOf(state.search.toLowerCase()) > -1
        );

        copyCategories.forEach(category => {
          category.elements = category.elements.filter((elem) => elem.title.toLowerCase().indexOf(state.search.toLowerCase()) > -1);
        })
      }
      state.filterCategories = copyCategories;
    },
    changeFilterElements(state) {
      let copyElements = state.elements.slice();

      if (state.search !== null) {
        copyElements = copyElements.filter(
          (elem) =>
          elem.title.toLowerCase().indexOf(state.search.toLowerCase()) > -1
        );
      }

      state.filterElements = copyElements;
    },
    insertCategory(state, payload) {
      const indexActiveElement = state.filterCategories.findIndex(el => el.id === payload.active);
      const indexCurrentElement = state.filterCategories.findIndex(el => el.id === payload.current);
      const deleteCategory = state.filterCategories.slice(0)[indexActiveElement];

      if (indexActiveElement > -1 && indexCurrentElement > -1) {
        state.filterCategories.splice(indexActiveElement, 1);

        setTimeout(() => {
          state.filterCategories.splice(indexCurrentElement, 0, deleteCategory);
        }, 1000);
      }

    },
    changeActiveElement(state, payload) {
      state.activeElement = payload;
    },
    changeCurrentElement(state, payload) {
      state.currentElement = payload;
    },
    changeElements(state, payload) {
      let deleteElement = null;

      if (payload.active.category === null) {
        deleteElement = state.filterElements.slice(0)[payload.active.index];
        state.filterElements.splice(payload.active.index, 1);
      } else {
        deleteElement = state.filterCategories[payload.active.category].elements.slice(0)[payload.active.index];
        state.filterCategories[payload.active.category].elements.splice(payload.active.index, 1);
      }

      if (payload.current.category === null) {
        setTimeout(() => {
          state.filterElements.splice(payload.current.index, 0, deleteElement);
        }, 1000);
      } else {
        setTimeout(() => {
          state.filterCategories[payload.current.category].elements.splice(payload.current.index, 0, deleteElement);
        }, 1000);
      }
    },
  },
  getters: {
    docsCategories(state) {
      return state.filterCategories;
    },
    docsElements(state) {
      return state.filterElements;
    },
    docsButtons(state) {
      return state.buttons;
    },
  },
  actions: {
    defineIndexElement({
      state,
      commit
    }, payload) {
      let indexElement = state.filterElements.findIndex(el => el.id === payload.id);
      let element = null;

      if (indexElement > -1) {
        element = {
          category: null,
          index: indexElement,
        };
      } else {
        state.filterCategories.forEach((category, index) => {
          indexElement = category.elements.findIndex(el => el.id === payload.id);
          if (indexElement > -1) {
            element = {
              category: index,
              index: indexElement,
            };
          }
        })
      }

      commit(payload.mutation, element);
    },
    insertElements({
      state,
      dispatch,
      commit
    }, payload) {
      dispatch("defineIndexElement", {
        id: payload.active,
        mutation: 'changeActiveElement'
      });
      dispatch("defineIndexElement", {
        id: payload.current,
        mutation: 'changeCurrentElement'
      });

      commit("changeElements", {
        active: state.activeElement,
        current: state.currentElement
      })
    }
  },
  modules: {}
})