import Vue from 'vue';
import MutableInputList from './components/mutable_input_list';
import TimezoneDropdown from './timezone_dropdown';

$(() => {
  const timezoneDropdown = document.querySelector('.js-timezone-dropdown');
  // const timezoneData = timezoneDropdown.dataset;

  new TimezoneDropdown({
    $input: timezoneDropdown,
  });
  const targetBranchDropdown = document.querySelector('.js-target-branch-dropdown');
  // const targetBranchData = targetBranchDropdown.dataset;

  new Vue({
    el: '#mutable-input-list',
    components: {
      'mutable-input-list': MutableInputList,
    },
  }).$mount();

  new Vue({});
});
