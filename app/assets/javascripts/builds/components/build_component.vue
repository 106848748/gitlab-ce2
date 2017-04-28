<script>
/* global Flash */

import Visibility from 'visibilityjs';
import Poll from '../../lib/utils/poll';
import BuildStore from '../stores/build_store';
import BuildService from '../services/build_service';

export default {
  components: {

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
    <section
      class="text-center"
      v-if="isLoading">
      <i
        class="fa fa-spin fa-spinner"
        aria-hidden="true"
        aria-label="Loading"
      />
    </section>

    <section v-else>
    </section>
  </section>
</template>
