<script>
/* global Flash */

import Visibility from 'visibilityjs';
import Poll from '../../lib/utils/poll';
import BuildStore from '../stores/build_store';
import BuildService from '../services/build_service';
import loadingIconComponent from '../../vue_shared/components/loading_icon_component.vue';

export default {
  components: {
    loadingIconComponent,
  },

  data() {
    const endpoint = '';
    const store = new BuildStore();

    return {
      isLoading: false,
      endpoint,
      store,
      state: store.state,
    };
  },

  created() {
    this.service = new BuildService(this.endpoint);

    const poll = new Poll({
      resource: this.service,
      method: 'get',
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
      this.store.storeBuild(data);
      this.isLoading = false;
    },

    errorCallback() {
      this.isLoading = false;
      // eslint-disable-next-line no-new
      new Flash('An error occurred while fetching the job.');
    },
  },

};
</script>
<template>
  <section>
    <loading-icon-component v-if="isLoading">

    <section v-else>
    </section>
  </section>
</template>
