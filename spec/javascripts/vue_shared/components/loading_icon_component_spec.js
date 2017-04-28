import Vue from 'vue';
import loadingIconComponent from '~/vue_shared/components/loading_icon_component.vue';

describe('Loading Icon Component', () => {
  let LoadingIconComponent;

  beforeEach(() => {
    LoadingIconComponent = Vue.extend(loadingIconComponent);
  });

  it('should render a spinner font awesome icon', () => {
    const component = new LoadingIconComponent().$mount();

    expect(
      component.$el.querySelector('i').getAttribute('class'),
    ).toEqual('fa fa-spin fa-spinner');

    expect(component.$el.tagName).toEqual('SPAN');
    expect(component.$el.classList.contains('text-center')).toEqual(true);
  });

  it('should render accessibility attributes', () => {
    const component = new LoadingIconComponent().$mount();

    const icon = component.$el.querySelector('i');
    expect(icon.getAttribute('aria-hidden')).toEqual('true');
    expect(icon.getAttribute('aria-label')).toEqual('Loading');
  });

  it('should render the provided label', () => {
    const component = new LoadingIconComponent({
      propsData: {
        label: 'This is a loading icon',
      },
    }).$mount();

    expect(
      component.$el.querySelector('i').getAttribute('aria-label'),
    ).toEqual('This is a loading icon');
  });
});
