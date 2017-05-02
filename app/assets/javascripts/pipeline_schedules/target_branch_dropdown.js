export default class TargetBranchDropdown {
  constructor({ $input }) {
    this.$dropdown = $($input);
    this.initDropdown();
  }
  listItemRenderer(item) {
    return `${item.name} - ${item.tzinfo.identifier}`;
  }
  initDropdown() {
    // TODO: In haml, only include needed props in data
    this.$dropdown.glDropdown({
      data: this.timezoneData,
      filterable: true,
      selectable: true,
      toggleLabel: item => item.name,
      search: {
        fields: ['name'],
      },
      // clicked: (query, el, e) => this.reportSelection(query.name, el, e),
      text: item => this.listItemRenderer(item),
    });
  }
}
