import { createStore } from 'vuex';

export const Views = {
  DEFAULT: 'default',
  OPTIONS: 'options'
}

export default createStore({
  state: {
    currentView: Views.DEFAULT, 
    viewContent: ""
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
      state.viewContent = value
    }
  },
  actions: {
    setCurrentView({ commit }, value) {
      let oldState = this.state.currentView;
      if (oldState === value) {
        commit('changeCurrentViewToDefault')
        console.log(`currentView state changed from ${oldState} to ${this.state.currentView}`)
        return
      } 
      commit('changeCurrentView', value);
      console.log(`currentView state changed from ${oldState} to ${this.state.currentView}`);
    },

    setViewContent({commit}, value) {
      console.log(`viewContent updated`)
      commit('changeViewContent', value);
    }
  },

  getters: {
    currentView: state => state.currentView,
    viewContent: state => state.viewContent
  },
});
