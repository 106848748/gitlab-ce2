export default {
  data() {
    return {
      newVariable: {
        key: '',
        value: '',
        unsaved: true,
      },
    };
  },
  props: {
    existingVariables: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addVariable() {
      this.existingVariables.push(this.newVariable);
    },
    removeVariable(idx) {
      this.existingVariables.splice(1, idx);
    },
  },
  template: `
    <div class='existing-variables-list' v-for='variable in existingVariables'
      <input :disabled='true' :value='variable.key'/>
      <input :disabled='true' :value='variable.value'/>
      <i class="fa fa-minus-circle" @click="removeVariable($index)">
      <span v-if='variable.unsaved'> Unsaved!</span>
    </div>

    <div>
      <input v-model='newVariable.key' placeholder="Variable key"/>
      <input v-model='newVariable.value' placeholder="Variable value"/>
      <i class="fa fa-plus-circle" @click="addVariable">
    </div>
  `,
};
