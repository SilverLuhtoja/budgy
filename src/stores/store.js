import { createStore } from 'vuex';

export const Views = {
  DEFAULT: 'default',
  OPTIONS: 'options',
  OVERVIEW: 'overview'
}

const ERROR_SECONDS_TIMER = 3

export default createStore({
  state: {
    currentView: Views.DEFAULT,
    viewContent: '',
    currentSelectedFile: '',
    errorMessage: '',
  },
  mutations: {
    changeCurrentView(state, value) {
      state.currentView = value;
    },
    changeCurrentViewToDefault(state) {
      state.currentView = 'default';
    },

    // View Content
    changeViewContent(state, value) {
      state.viewContent = value;
    },

    // Current Selected File
    changeCurrentSelectedFile(state, value) {
      state.currentSelectedFile = value;
    },

    // errors

    changeErrorMessage(state, value) {
      state.errorMessage = value;
    },
  },
  actions: {
    setCurrentView({ commit }, value) {
      let oldState = this.state.currentView;
      if (oldState === value) {
        commit('changeCurrentViewToDefault');
        return;
      }
      commit('changeCurrentView', value);
    },

    setViewContent({ commit }, value) {
      commit('changeViewContent', value);
    },

    setCurrentSelectedFile({ commit }, value) {
      let oldState = this.state.currentSelectedFile;
      if (oldState !== value) {
        commit('changeCurrentSelectedFile', value);
      }
    },

    setErrorMessage({ commit }, value) {
      commit('changeErrorMessage', value);

      setTimeout(() => {
        commit('changeErrorMessage', '');
      }, ERROR_SECONDS_TIMER * 1000);
    },
  },

  getters: {
    currentView: state => state.currentView,
    viewContent: state => state.viewContent,
    currentSelectedFile: state => state.currentSelectedFile,
    errorMessage: state => state.errorMessage,
  },
});
