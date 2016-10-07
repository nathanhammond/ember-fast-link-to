import Ember from 'ember';
import layout from '../templates/components/fast-link-to';

let { assert, get, inject, deprecate, ControllerMixin } = Ember;
let EmberComponent = Ember.Component;


let FastLinkComponent = EmberComponent.extend({
  layout: layout,

  tagName: 'a',

  /**
    Sets the `title` attribute of the `FastLinkComponent`'s HTML element.

    @property title
    @default null
    @public
  **/
  title: null,

  /**
    Sets the `rel` attribute of the `FastLinkComponent`'s HTML element.

    @property rel
    @default null
    @public
  **/
  rel: null,

  /**
    Sets the `tabindex` attribute of the `FastLinkComponent`'s HTML element.

    @property tabindex
    @default null
    @public
  **/
  tabindex: null,

  /**
    Sets the `target` attribute of the `FastLinkComponent`'s HTML element.

    @since 1.8.0
    @property target
    @default null
    @public
  **/
  target: null,

  /**
    The CSS class to apply to `FastLinkComponent`'s element when its `loading`
    property is `true`.

    @property loadingClass
    @type String
    @default loading
    @private
  **/
  loadingClass: 'loading',

  /**
    The CSS class to apply to a `FastLinkComponent`'s element when its `disabled`
    property is `true`.

    @property disabledClass
    @type String
    @default disabled
    @private
  **/
  disabledClass: 'disabled',
  _isDisabled: false,

  /**
    Determines whether the `FastLinkComponent` will trigger routing via
    the `replaceWith` routing strategy.

    @property replace
    @type Boolean
    @default false
    @public
  **/
  replace: false,

  /**
    By default the `{{fast-link-to}}` component will bind to the `href` and
    `title` attributes. It's discouraged that you override these defaults,
    however you can push onto the array if needed.

    @property attributeBindings
    @type Array | String
    @default ['title', 'rel', 'tabindex', 'target']
    @public
  */
  attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

  /**
    By default the `{{fast-link-to}}` component will bind to the `loading` and
    `disabled` classes. It is discouraged to override these directly.

    @property classNameBindings
    @type Array
    @default ['loading', 'disabled']
    @public
  */
  classNameBindings: ['loading', 'disabled'],

  /**
    By default the `{{fast-link-to}}` component responds to the `click` event. You
    can override this globally by setting this property to your custom
    event name.

    This is particularly useful on mobile when one wants to avoid the 300ms
    click delay using some sort of custom `tap` event.

    @property eventName
    @type String
    @default click
    @private
  */
  eventName: 'click',

  // this is doc'ed here so it shows up in the events
  // section of the API documentation, which is where
  // people will likely go looking for it.
  /**
    Triggers the `FastLinkComponent`'s routing behavior. If
    `eventName` is changed to a value other than `click`
    the routing behavior will trigger on that custom event
    instead.

    @event click
    @private
  */

  /**
    An overridable method called when `FastLinkComponent` objects are instantiated.

    Example:

    ```javascript
    App.MyLinkComponent = Ember.FastLinkComponent.extend({
      init: function() {
        this._super.apply(this, arguments);
        Ember.Logger.log('Event is ' + this.get('eventName'));
      }
    });
    ```

    NOTE: If you do override `init` for a framework class like `Ember.View`,
    be sure to call `this._super.apply(this, arguments)` in your
    `init` declaration! If you don't, Ember may not have an opportunity to
    do important setup work, and you'll see strange behavior in your
    application.

    @method init
    @private
  */
  init: Ember.LinkComponent.proto().init,

  _routing: inject.service('-routing'),

  disabled: Ember.LinkComponent.proto().disabled,

  /**
    Event handler that invokes the link, activating the associated route.

    @private
    @method _invoke
    @param {Event} event
    @private
  */
  _invoke: Ember.LinkComponent.proto()._invoke,

  /**
    As of 2.7 series, this function actually initiates the transition. Having
    it available in older version will do nothing.

    @private
    @method _generateTransition
  */
  _generateTransition: Ember.LinkComponent.proto()._generateTransition,

  queryParams: null,

  /* These two exist to support 1.13. */
  _computeRouteNameWithQueryParams: Ember.LinkComponent.proto()._computeRouteNameWithQueryParams,

  _handleOnlyQueryParamsSupplied: Ember.LinkComponent.proto()._handleOnlyQueryParamsSupplied,

  qualifiedRouteName: Ember.LinkComponent.proto().qualifiedRouteName,

  resolvedQueryParams: Ember.LinkComponent.proto().resolvedQueryParams,

  /**
    Sets the element's `href` attribute to the url for
    the `FastLinkComponent`'s targeted route.

    If the `FastLinkComponent`'s `tagName` is changed to a value other
    than `a`, this property will be ignored.

    @property href
    @private
  */
  href: Ember.LinkComponent.proto().href,

  loading: Ember.LinkComponent.proto().loading,

  _modelsAreLoaded: Ember.LinkComponent.proto()._modelsAreLoaded,

  _getModels: Ember.LinkComponent.proto()._getModels || function(params) {
    let modelCount = params.length - 1;
    let models = new Array(modelCount);

    for (let i = 0; i < modelCount; i++) {
      let value = params[i + 1];

      while (ControllerMixin.detect(value)) {
        deprecate(
          'Providing `{{link-to}}` with a param that is wrapped in a controller is deprecated. ' +
            (this.parentView ? 'Please update `' + this.parentView + '` to use `{{link-to "post" someController.model}}` instead.' : ''),
          false,
          { id: 'ember-routing-views.controller-wrapped-param', until: '3.0.0' }
        );
        value = value.get('model');
      }

      models[i] = value;
    }

    return models;
  },

  /**
    The default href value to use while a fast-link-to is loading.
    Only applies when tagName is 'a'

    @property loadingHref
    @type String
    @default #
    @private
  */
  loadingHref: '#',

  didRecieveAttrs() {
    let queryParams;

    // We will always have a block.
    this.set('attrs.hasBlock', true);

    // Do not mutate params in place
    let params = get(this, 'params').slice();

    assert('You must provide one or more parameters to the fast-link-to component.', params.length);

    // Process the positional arguments, in order.

    // 2. `targetRouteName` is now always at index 0.
    let owner = Ember.getOwner && Ember.getOwner(this);
    if (owner && owner.mountPoint) {
      let fullRouteName = owner.mountPoint + '.' + params[0];
      this.set('targetRouteName', fullRouteName);
    } else {
      this.set('targetRouteName', params[0]);
    }

    // 3. The last argument (if still remaining) is the `queryParams` object.
    let lastParam = params[params.length - 1];

    if (lastParam && lastParam.isQueryParams) {
      queryParams = params.pop();
    } else {
      queryParams = {};
    }
    this.set('queryParams', queryParams);

    // 4. Any remaining indices (excepting `targetRouteName` at 0) are `models`.
    if (params.length > 1) {
      this.set('models', this._getModels(params));
    } else {
      this.set('models', []);
    }
  }
});

FastLinkComponent.toString = function() { return 'FastLinkComponent'; };

FastLinkComponent.reopenClass({
  positionalParams: 'params'
});

export default FastLinkComponent;
