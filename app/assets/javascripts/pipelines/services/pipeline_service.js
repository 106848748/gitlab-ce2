import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);

export default class PipelineService {
  constructor(root) {
    let endpoint;

    if (root.indexOf('.json') === -1) {
      endpoint = `${root}.json`;
    } else {
      endpoint = root;
    }

    this.pipeline = Vue.resource(endpoint);
  }

  getPipeline() {
    return this.pipeline.get();
  }
}
