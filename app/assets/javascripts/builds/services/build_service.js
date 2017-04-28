import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export default class BuildService {
  constructor(endpoint) {
    this.build = Vue.resource(endpoint);
  }

  get() {
    return this.build.get();
  }
}
