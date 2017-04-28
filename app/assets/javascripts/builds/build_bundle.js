import Vue from 'vue';
import buildApp from './components/build_component.vue';

document.addEventListener('DOMContentLoaded', () => new Vue({
  el: '#',
  components: {
    buildApp,
  },
  render: createElement => createElement('build-app'),
}));
