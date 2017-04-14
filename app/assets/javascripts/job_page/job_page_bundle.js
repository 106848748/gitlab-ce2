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
    ciStatus: { type: String, required: true },
  },
  template: `<div> {{ ciStatus }} </div>`,
};

window.gl.jobPageData = {};

Object.assign(gl.jobPageData, {
  job_id: '123432345',
  ci_status: 'failed',
  ci_status_title: 'The build failed.',
  user: {
    profileUrl: 'http://profile-url.com',
    avatarUrl: 'http://avatar-url.com',
    name: 'My User Name',
  },
  new_issue_url: 'http://new-issue.com',
  retry_job_url: 'http://retry-job.com',
  triggered_at: new Date(),
});

class JobPageStore {
  constructor(data) {
    this.sidebarState = {};
    this.pipeline = data.pipeline;
    this.jobId = data.job_id;
    this.ciStatus = data.ci_status;
    this.ciStatusTitle = data.ci_status_title;
    this.user = data.user;
    this.newIssueUrl = data.new_issue_url;
    this.retryJobUrl = data.retry_job_url;
    this.triggeredAt = data.triggered_at;
    // user can retry
    // build failed
    // build is retryable
    // user can create issue
  }
}

const JobPageHeader = {
  props: {
    retryJobUrl: { type: String, required: false },
    newIssueUrl: { type: String, required: false },
    ciStatus: { type: String, required: true },
    ciStatusTitle: { type: String, required: true },
    jobId: { type: String, required: true },
    user: { type: Object, required: false },
    triggeredAt: { type: Date, required: true },
  },
  components: {
    'ci-status-badge': CiStatusBadge,
  },
  template: `
    <div class="content-block build-header top-area">
      <div class="header-content">
        <ci-status-badge :ci-status='ciStatus' :ci-status-title='ciStatusTitle'></ci-status-badge>
        Job
        <strong class="js-build-id"> #{{jobId}} </strong>
        triggered
        <span> {{ triggeredAt }} </span>
        <span>
          by
          <a v-once :href='user.profileUrl'> {{ user.name }} </a>
          <img v-once :src='user.avatarUrl'/>
        </span>
        <div class="nav-controls">
          <a class="btn btn-new btn-inverted" v-once :href='newIssueUrl' > New Issue </a>
          <a class="btn btn-inverted-secondary" v-once :href='retryJobUrl' rel="nofollow"> Retry job </a>
          <button class='btn btn-default pull-right visible-xs-block visible-sm-block build-gutter-toggle js-sidebar-build-toggle' role='button' type='button'>
            <i class='fa fa-angle-double-left'></i>
          </button>
        </div>
      </div>
    </div>
    `,
  };

// .content-block.build-header.top-area
//   .header-content
  //   = render 'ci/status/badge', status: @build.detailed_status(current_user), link: false, title: @build.status_title
//     Job
//     %strong.js-build-id ##{@build.id}
//     in pipeline
//     = link_to pipeline_path(pipeline) do
//       %strong ##{pipeline.id}
//     for commit
//     = link_to namespace_project_commit_path(@project.namespace, @project, pipeline.sha) do
//       %strong= pipeline.short_sha
//     from
//     = link_to namespace_project_commits_path(@project.namespace, @project, @build.ref) do
//       %code
//         = @build.ref
//     - if @build.user
//       = render "user"
//     = time_ago_with_tooltip(@build.created_at)
//   .nav-controls
//     - if can?(current_user, :create_issue, @project) && @build.failed?
//       = link_to "New issue", new_namespace_project_issue_path(@project.namespace, @project, issue: build_failed_issue_options), class: 'btn btn-new btn-inverted'
//     - if can?(current_user, :update_build, @build) && @build.retryable?
//       = link_to "Retry job", retry_namespace_project_build_path(@project.namespace, @project, @build), class: 'btn btn-inverted-secondary', method: :post
//   %button.btn.btn-default.pull-right.visible-xs-block.visible-sm-block.build-gutter-toggle.js-sidebar-build-toggle{ role: "button", type: "button" }
//     = icon('angle-double-left')
// };
//
const JobDetailsSidebar = {
  template: `<div> Hello Job Page Sidebar </div>`,
};

document.addEventListener('DOMContentLoaded', () => {
  const jobPageData = window.gl.jobPageData;

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
