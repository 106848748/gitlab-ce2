/* eslint-disable no-param-reassign */

import Vue from 'vue';
import UserAvatarImage from '../../vue_shared/components/user_avatar/user_avatar_image';

const global = window.gl || (window.gl = {});
global.cycleAnalytics = global.cycleAnalytics || {};

global.cycleAnalytics.StageCodeComponent = Vue.extend({
  props: {
    items: Array,
    stage: Object,
  },
  components: {
    'user-avatar-image': UserAvatarImage,
  },
  template: `
    <div>
      <div class="events-description">
        {{ stage.description }}
        <limit-warning :count="items.length" />
      </div>
      <ul class="stage-event-list">
        <li v-for="mergeRequest in items" class="stage-event-item">
          <div class="item-details">
            <!-- FIXME: Pass an alt attribute here for accessibility -->
            <user-avatar-image :src="mergeRequest.author.avatarUrl"/>
            <h5 class="item-title merge-merquest-title">
              <a :href="mergeRequest.url">
                {{ mergeRequest.title }}
              </a>
            </h5>
            <a :href="mergeRequest.url" class="issue-link">!{{ mergeRequest.iid }}</a>
            &middot;
            <span>
              Opened
              <a :href="mergeRequest.url" class="issue-date">{{ mergeRequest.createdAt }}</a>
            </span>
            <span>
              by
              <a :href="mergeRequest.author.webUrl" class="issue-author-link">{{ mergeRequest.author.name }}</a>
            </span>
          </div>
          <div class="item-time">
            <total-time :time="mergeRequest.totalTime"></total-time>
          </div>
        </li>
      </ul>
    </div>
  `,
});
