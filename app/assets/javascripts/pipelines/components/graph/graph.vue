<script>
  import Visibility from 'visibilityjs';
  import Poll from '../../../lib/utils/poll';
  import PipelineService from '../../services/pipeline_service';
  import PipelineStore from '../../stores/pipeline_store';
  import stageColumnComponent from './stage_column.vue';

  export default {
    components: {
      stageColumnComponent,
    },

    data() {
      const DOMdata = this.$options.parent.$el.dataset;
      const store = new PipelineStore();

      return {
        isLoading: false,
        endpoint: DOMdata.endpoint,
        store,
        state: store.state,
      };
    },

    created() {
      this.service = new PipelineService(this.endpoint);

      const poll = new Poll({
        resource: this.service,
        method: 'getPipeline',
        successCallback: this.successCallback,
        errorCallback: this.errorCallback,
      });

      if (!Visibility.hidden()) {
        this.isLoading = true;
        poll.makeRequest();
      }

      Visibility.change(() => {
        if (!Visibility.hidden()) {
          poll.restart();
        } else {
          poll.stop();
        }
      });
    },

    methods: {
      successCallback(response) {
        const data = response.json();

        this.isLoading = false;
        this.store.storeGraph(data.stages);
      },

      errorCallback() {
        this.isLoading = false;
        // Warn user!
      },
    },
  };
</script>
<template>
  <div class="build-content middle-block js-pipeline-graph">
    <div class="pipeline-visualization pipeline-graph">
      <i
        v-if="isLoading"
        class="fa fa-spin fa-spinner"
        aria-label="Loading" />

      <ul
        v-if="!isLoading"
        class="stage-column-list">
        <stage-column-component
          v-for="stage in state.graph"
          :title="stage.title"
          :jobs="stage.jobs"
          :key="stage.name"/>
      </ul>
    </div>
  </div>
</template>
