import Vue from 'vue';

// TODO:
// - Look for existing components for CI status badge and user avatar (filipa)
// - Properly pass build data
// - Use existing timeAgo logic
// - Style as before
// - Think through sidebar and other UI state
// - Make a list of exactly what is needed exposed
// - Change job to build
// - List all possible interactions and how they impact state/data
// - Double check proper use of v-once / static values
// - List what should be included in specs
const CiStatusBadge = {
  props: {
    ciStatusText: { type: String, required: true },
    ciStatusTitleText: { type: String, required: true },
  },
  template: `<div> {{ ciStatusText }} and title: {{ ciStatusTitleText }} </div>`,
};

window.gl.jobPageData = {};

class JobPageStore {
  constructor(data) {
    this.sidebarState = {};
    Object.assign(this, data);
    // build is retryable
  }
}

const JobPageHeader = {
  props: {
    retryJobUrl: { type: String, required: false },
    newIssueUrl: { type: String, required: false },
    ciStatusText: { type: String, required: true },
    ciStatusTitleText: { type: String, required: true },
    jobId: { type: Number, required: true },
    jobOwner: { type: Object, required: false },
    jobFailed: { type: Boolean, required: true },
    jobRetryable: { type: Boolean, required: true },
    jobTriggeredAt: { type: String, required: true },
    userCanRetryJob: { type: Boolean, required: true },
    userCanCreateIssue: { type: Boolean, required: true},
  },
  components: {
    'ci-status-badge': CiStatusBadge,
  },
  template: `
    <div class="content-block build-header top-area">
      <div class="header-content">
        <ci-status-badge :ci-status-text='ciStatusText' :ci-status-title-text='ciStatusTitleText'></ci-status-badge>
        Job
        <strong class="js-build-id"> #{{jobId}} </strong>
        triggered
        <span> {{ jobTriggeredAt }} </span>
        <span>
          by
          <a v-once :href='jobOwner.profileUrl'> {{ jobOwner.name }} </a>
          <img v-once :src='jobOwner.avatarUrl'/>
        </span>
        <div class="nav-controls">
          <a class="btn btn-new btn-inverted" v-if='userCanCreateIssue' :href='newIssueUrl' > New Issue </a>
          <a class="btn btn-inverted-secondary" v-if='userCanRetryJob && jobFailed' :href='retryJobUrl' rel="nofollow"> Retry job </a>
          <button class='btn btn-default pull-right visible-xs-block visible-sm-block build-gutter-toggle js-sidebar-build-toggle' role='button' type='button'>
            <i class='fa fa-angle-double-left'></i>
          </button>
        </div>
      </div>
    </div>
    `,
  };

const JobDetailsSidebar = {
  template: `<div> Hello Job Page Sidebar </div>`,
};

document.addEventListener('DOMContentLoaded', () => {
  const jobPageData = $('#job-page-app').data();
  new Vue({
    el: '#job-page-app',
    components: {
      'job-page-header': JobPageHeader,
      'job-details-sidebar': JobDetailsSidebar,
    },
    data: {
      job: new JobPageStore(jobPageData),
    },
    created() {
      console.log("Created");
    },
    methods: {
      updateJobStatus(data) {
        // async update
        this.job = data;
      }
    }
  });

  // Given that it doesn't close, is it really neccessary here?
  new Sidebar();
});
