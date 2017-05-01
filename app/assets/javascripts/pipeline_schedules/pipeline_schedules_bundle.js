import Vue from 'vue';
import MutableInputList from './components/mutable_input_list';
import TimezoneDropdown from './timezone_dropdown';

// const timezoneDropdown = document.querySelector('.timezone-dropdown');
// const timezoneData = timezoneDropdown.dataset;

// new TimezoneDropdown({ dropdown: timezoneDropdown, data: timezoneData });

// const targetBranchDropdown = document.querySelector('.target-branch-dropdown');
// const targetBranchData = targetBranchDropdown.dataset;

// new TargetBranchDropdown({ dropdown: targetBranchDropdown, data: targetBranchData });

$(() => {
  new Vue({
    el: '#mutable-input-list',
    components: {
      'mutable-input-list': MutableInputList,
    },
  }).$mount();
});
