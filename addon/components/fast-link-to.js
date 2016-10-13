import Ember from 'ember';

export default Ember.LinkComponent.extend({
  classNameBindings: ['loading', 'disabled']
});

// import layout from '../templates/components/fast-link-to';

// let { Component, generateGuid, get, getOwner, LinkComponent } = Ember;

// function findOriginal(PrototypeMixin) {
//   if (!PrototypeMixin.ownerConstructor) { return; }

//   let result;
//   let identity = PrototypeMixin.ownerConstructor.toString();
//   if (identity === 'LinkComponent') {
//     return PrototypeMixin.mixins[1].properties;
//   } else {
//     for (let i = 0; i < PrototypeMixin.mixins.length; i++) {
//       result = findOriginal(PrototypeMixin.mixins[i]);
//       if (result) { return result; }
//     }
//   }
// }

// let linkProto = findOriginal(LinkComponent.PrototypeMixin);
// let properties = Object.keys(linkProto);
// let fastLinkProto = {};

// for (let i = 0; i < properties.length; i++) {
//   fastLinkProto[properties[i]] = linkProto[properties[i]];
// }

// fastLinkProto.classNameBindings = ['loading', 'disabled'];
// fastLinkProto.layout = layout;

// function supportEngines() {
//   let params = get(this, 'params');

//   let owner = getOwner && getOwner(this);
//   if (owner && owner.mountPoint) {
//     let fullRouteName = owner.mountPoint + '.' + params[0];
//     this.set('targetRouteName', fullRouteName);
//   }
// }

// if (linkProto.willRender) {
//   fastLinkProto.init = function() {
//     linkProto.init.apply(this, arguments);

//     // Support 1.13.
//     // Harmless in other versions.
//     this.set('attrs.hasBlock', true);

//     // Support 1.13 and 2.0 which don't set up `elementId`.
//     var elementId = this.get('elementId');
//     if (!elementId) {
//       this.set('elementId', generateGuid());
//     }
//   };
//   fastLinkProto.willRender = function() {
//     linkProto.willRender.apply(this, arguments);
//     supportEngines.apply(this, arguments);
//   };
// } else {
//   fastLinkProto.didReceiveAttrs = function() {
//     linkProto.didReceiveAttrs.apply(this, arguments);
//     supportEngines.apply(this, arguments);
//   };
// }

// let FastLinkComponent = Component.extend(fastLinkProto);

// FastLinkComponent.toString = function() { return 'FastLinkComponent'; };

// FastLinkComponent.reopenClass({
//   positionalParams: 'params'
// });

// export default FastLinkComponent;
