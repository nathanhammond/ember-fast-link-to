import Ember from 'ember';
import layout from '../templates/components/fast-link-to';

let { get } = Ember;
let EmberComponent = Ember.Component;

var linkProto = Ember.LinkComponent.proto();
var properties = Object.keys(linkProto);
var fastLinkProto = {};

for (var i = 0; i < properties.length; i++) {
  fastLinkProto[properties[i]] = linkProto[properties[i]];
}

fastLinkProto.classNameBindings = ['loading', 'disabled'];
fastLinkProto.layout = layout;

function supportEngines() {
  let params = get(this, 'params');

  let owner = Ember.getOwner && Ember.getOwner(this);
  if (owner && owner.mountPoint) {
    let fullRouteName = owner.mountPoint + '.' + params[0];
    this.set('targetRouteName', fullRouteName);
  }
}

if (linkProto.willRender) {
  fastLinkProto.init = function() {
    // Support 1.13+
    // We will always have a block.
    this.set('attrs.hasBlock', true);
    linkProto.init.apply(this, arguments);
  };
  fastLinkProto.willRender = function() {
    linkProto.willRender.apply(this, arguments);
    supportEngines.apply(this, arguments);
  };
} else {
  fastLinkProto.didReceiveAttrs = function() {
    linkProto.didReceiveAttrs.apply(this, arguments);
    supportEngines.apply(this, arguments);
  };
}

let FastLinkComponent = EmberComponent.extend(fastLinkProto);

FastLinkComponent.toString = function() { return 'FastLinkComponent'; };

FastLinkComponent.reopenClass({
  positionalParams: 'params'
});

export default FastLinkComponent;
