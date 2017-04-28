export default class BuildStore {
  constructor() {
    this.state = {};
  }

  storeBuild(build = {}) {
    this.state.build = build;
  }
}
