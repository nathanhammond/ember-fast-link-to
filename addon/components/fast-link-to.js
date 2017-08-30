import Ember from 'ember';

export default Ember.LinkComponent.extend({
  init() {
    this._super(...arguments);
    this.classNameBindings = ["loading", "disabled"];
  }
});
