import Ember from 'ember';
import layout from '../templates/components/link-three';

let { assert, computed, deprecate, get, inject, ControllerMixin, Logger } = Ember;
let EmberComponent = Ember.Component;
let isSimpleClick = Ember.ViewUtils.isSimpleClick;


let LinkThreeComponent = EmberComponent.extend({
  layout: layout,

  tagName: 'a',

  /**
    Sets the `title` attribute of the `LinkComponent`'s HTML element.

    @property title
    @default null
    @public
  **/
  title: null,

  /**
    Sets the `rel` attribute of the `LinkComponent`'s HTML element.

    @property rel
    @default null
    @public
  **/
  rel: null,

  /**
    Sets the `tabindex` attribute of the `LinkComponent`'s HTML element.

    @property tabindex
    @default null
    @public
  **/
  tabindex: null,

  /**
    Sets the `target` attribute of the `LinkComponent`'s HTML element.

    @since 1.8.0
    @property target
    @default null
    @public
  **/
  target: null,

  /**
    The CSS class to apply to `LinkComponent`'s element when its `loading`
    property is `true`.

    @property loadingClass
    @type String
    @default loading
    @private
  **/
  loadingClass: 'loading',

  /**
    Determines whether the `LinkComponent` will trigger routing via
    the `replaceWith` routing strategy.

    @property replace
    @type Boolean
    @default false
    @public
  **/
  replace: false,

  /**
    By default the `{{link-to}}` component will bind to the `href` and
    `title` attributes. It's discouraged that you override these defaults,
    however you can push onto the array if needed.

    @property attributeBindings
    @type Array | String
    @default ['title', 'rel', 'tabindex', 'target']
    @public
  */
  attributeBindings: ['href', 'title', 'rel', 'tabindex', 'target'],

  /**
    By default the `{{link-to}}` component will bind to the `loading`,
    class. It is discouraged to override these directly.

    @property classNameBindings
    @type Array
    @default ['loading']
    @public
  */
  classNameBindings: ['loading'],

  /**
    By default the `{{link-to}}` component responds to the `click` event. You
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
    Triggers the `LinkComponent`'s routing behavior. If
    `eventName` is changed to a value other than `click`
    the routing behavior will trigger on that custom event
    instead.

    @event click
    @private
  */

  /**
    An overridable method called when `LinkComponent` objects are instantiated.

    Example:

    ```javascript
    App.MyLinkComponent = Ember.LinkComponent.extend({
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
  init() {
    this._super(...arguments);

    // Map desired event name to invoke function
    let eventName = get(this, 'eventName');
    this.on(eventName, this, this._invoke);
  },

  _routing: inject.service('-routing'),

  /**
    Event handler that invokes the link, activating the associated route.

    @private
    @method _invoke
    @param {Event} event
    @private
  */
  _invoke(event) {
    if (!isSimpleClick(event)) { return true; }

    let preventDefault = get(this, 'preventDefault');
    let targetAttribute = get(this, 'target');

    if (preventDefault !== false) {
      if (!targetAttribute || targetAttribute === '_self') {
        event.preventDefault();
      }
    }

    if (get(this, 'bubbles') === false) { event.stopPropagation(); }

    if (get(this, 'loading')) {
      Logger.warn('This link-to is in an inactive loading state because at least one of its parameters presently has a null/undefined value, or the provided route name is invalid.');
      return false;
    }

    if (targetAttribute && targetAttribute !== '_self') {
      return false;
    }

    let routing = get(this, '_routing');
    let qualifiedRouteName = get(this, 'qualifiedRouteName');
    let models = get(this, 'models');
    let queryParamValues = get(this, 'queryParams.values');
    let shouldReplace = get(this, 'replace');

    routing.transitionTo(qualifiedRouteName, models, queryParamValues, shouldReplace);
  },

  queryParams: null,

  qualifiedRouteName: computed('targetRouteName', '_routing.currentState', function computeLinkToComponentQualifiedRouteName() {
    let params = get(this, 'params').slice();
    let lastParam = params[params.length - 1];
    if (lastParam && lastParam.isQueryParams) {
      params.pop();
    }
    let onlyQueryParamsSupplied = (params.length === 1);
    if (onlyQueryParamsSupplied) {
      return get(this, '_routing.currentRouteName');
    }
    return get(this, 'targetRouteName');
  }),

  resolvedQueryParams: computed('queryParams', function computeLinkToComponentResolvedQueryParams() {
    let resolvedQueryParams = {};
    let queryParams = get(this, 'queryParams');

    if (!queryParams) { return resolvedQueryParams; }

    let values = queryParams.values;
    for (let key in values) {
      if (!values.hasOwnProperty(key)) { continue; }
      resolvedQueryParams[key] = values[key];
    }

    return resolvedQueryParams;
  }),

  /**
    Sets the element's `href` attribute to the url for
    the `LinkComponent`'s targeted route.

    If the `LinkComponent`'s `tagName` is changed to a value other
    than `a`, this property will be ignored.

    @property href
    @private
  */
  href: computed('models', 'qualifiedRouteName', function computeLinkToComponentHref() {
    if (get(this, 'tagName') !== 'a') { return; }

    let qualifiedRouteName = get(this, 'qualifiedRouteName');
    let models = get(this, 'models');

    if (get(this, 'loading')) { return get(this, 'loadingHref'); }

    let routing = get(this, '_routing');
    let queryParams = get(this, 'queryParams.values');
    return routing.generateURL(qualifiedRouteName, models, queryParams);
  }),

  loading: computed('_modelsAreLoaded', 'qualifiedRouteName', function computeLinkToComponentLoading() {
    let qualifiedRouteName = get(this, 'qualifiedRouteName');
    let modelsAreLoaded = get(this, '_modelsAreLoaded');

    if (!modelsAreLoaded || qualifiedRouteName == null) {
      return get(this, 'loadingClass');
    }
  }),

  _modelsAreLoaded: computed('models', function computeLinkToComponentModelsAreLoaded() {
    let models = get(this, 'models');
    for (let i = 0, l = models.length; i < l; i++) {
      if (models[i] == null) { return false; }
    }

    return true;
  }),

  _getModels(params) {
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
    The default href value to use while a link-to is loading.
    Only applies when tagName is 'a'

    @property loadingHref
    @type String
    @default #
    @private
  */
  loadingHref: '#',

  willRender() {
    let queryParams;

    // Do not mutate params in place
    let params = get(this, 'params').slice();

    assert('You must provide one or more parameters to the link-to component.', params.length);

    // Process the positional arguments, in order.

    // 2. `targetRouteName` is now always at index 0.
    this.set('targetRouteName', params[0]);

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

LinkThreeComponent.toString = function() { return 'LinkThreeComponent'; };

LinkThreeComponent.reopenClass({
  positionalParams: 'params'
});

export default LinkThreeComponent;
