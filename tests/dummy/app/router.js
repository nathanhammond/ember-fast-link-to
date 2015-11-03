import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('one', {path: '/one/:something'});
  this.route('two');
  this.route('three');
  this.route('four');
});

export default Router;
