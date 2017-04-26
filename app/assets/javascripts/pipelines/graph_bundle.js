import Vue from 'vue';
import pipelineGraph from './components/graph/graph.vue';

document.addEventListener('DOMContentLoaded', () => new Vue({
  el: '#js-pipeline-graph-vue',
  components: {
    pipelineGraph,
  },
  render: createElement => createElement('pipeline-graph'),
}));
