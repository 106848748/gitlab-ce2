/* eslint-disable no-new */
/* global Flash */
import DropLab from './droplab/drop_lab';
import InputSetter from './droplab/plugins/input_setter';

const CREATE_MERGE_REQUEST = 'create-mr';
const CREATE_BRANCH = 'create-branch';

export default class CreateMergeRequestDropdown {
  constructor(wrapperEl) {
    this.wrapperEl = wrapperEl;
    this.createMergeRequestButton = this.wrapperEl.querySelector('.js-create-merge-request');
    this.dropdownToggle = this.wrapperEl.querySelector('.dropdown-toggle');
    this.dropdownList = this.wrapperEl.querySelector('.dropdown-menu');
    this.availableButton = this.wrapperEl.querySelector('.available');
    this.unavailableButton = this.wrapperEl.querySelector('.unavailable');

    this.droplabInitialized = false;
    this.isCreatingMergeRequest = false;
    this.mergeRequestCreated = false;
    this.isCreatingBranch = false;
    this.branchCreated = false;

    this.init();
  }

  init() {
    this.checkAbilityToCreateBranch();
  }

  available() {
    this.availableButton.classList.remove('hide');
    this.unavailableButton.classList.add('hide');
  }

  unavailable() {
    this.availableButton.classList.add('hide');
    this.unavailableButton.classList.remove('hide');
  }

  enable() {
    this.createMergeRequestButton.classList.remove('disabled');
    this.createMergeRequestButton.removeAttribute('disabled');

    this.dropdownToggle.classList.remove('disabled');
    this.dropdownToggle.removeAttribute('disabled');
  }

  disable() {
    this.createMergeRequestButton.classList.add('disabled');
    this.createMergeRequestButton.setAttribute('disabled', 'disabled');

    this.dropdownToggle.classList.add('disabled');
    this.dropdownToggle.setAttribute('disabled', 'disabled');
  }

  checkAbilityToCreateBranch() {
    const xhr = $.getJSON(this.wrapperEl.dataset.canCreatePath);

    xhr.done((data) => {
      if (data.can_create_branch) {
        this.available();
        this.enable();

        if (!this.droplabInitialized) {
          this.droplabInitialized = true;
          this.initDroplab();
          this.bindEvents();
        }
      }
    });

    xhr.fail(() => {
      this.unavailable(); // just to make sure
      this.disable();
      new Flash('Failed to check if a new branch can be created.');
    });

    return xhr;
  }

  initDroplab() {
    this.droplab = new DropLab();

    this.droplab.init(this.dropdownToggle, this.dropdownList, [InputSetter],
      this.getDroplabConfig());
  }

  getDroplabConfig() {
    return {
      InputSetter: [{
        input: this.createMergeRequestButton,
        valueAttribute: 'data-value',
        inputAttribute: 'data-action',
      }, {
        input: this.createMergeRequestButton,
        valueAttribute: 'data-text',
      }],
    };
  }

  bindEvents() {
    this.createMergeRequestButton
      .addEventListener('click', this.onClickCreateMergeRequestButton.bind(this));
  }

  isBusy() {
    return this.isCreatingMergeRequest ||
      this.mergeRequestCreated ||
      this.isCreatingBranch ||
      this.branchCreated;
  }

  onClickCreateMergeRequestButton(e) {
    let xhr = null;
    e.preventDefault();

    if (this.isBusy()) {
      return;
    }

    if (e.target.dataset.action === CREATE_MERGE_REQUEST) {
      xhr = this.createMergeRequest();
    } else if (e.target.dataset.action === CREATE_BRANCH) {
      xhr = this.createBranch();
    }

    xhr.error(() => {
      this.isCreatingMergeRequest = false;
      this.isCreatingBranch = false;
    });

    xhr.always(() => this.enable());

    this.disable();
  }

  createMergeRequest() {
    const xhr = $.ajax({
      method: 'POST',
      dataType: 'json',
      url: this.wrapperEl.dataset.createMrPath,
    });

    this.isCreatingMergeRequest = true;

    xhr.done((data) => {
      this.mergeRequestCreated = true;
      window.location.href = data.url;
    });

    xhr.fail(() => new Flash('Failed to create Merge Request. Please try again.'));

    return xhr;
  }

  createBranch() {
    const xhr = $.ajax({
      method: 'POST',
      dataType: 'json',
      url: this.wrapperEl.dataset.createBranch,
    });

    this.isCreatingBranch = true;

    xhr.done((data) => {
      this.branchCreated = true;
      window.location.href = data.url;
    });

    xhr.fail(() => new Flash('Failed to create a branch for this issue. Please try again.'));

    return xhr;
  }
}
