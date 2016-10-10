import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fast-link-to', 'Integration | Component | fast link to', {
  integration: true,
  beforeEach() {
    const Router = this.container.lookupFactory('router:main');
    Router.map(function() {
      this.route('one', {path: '/one/:something'});
      this.route('two');
      this.route('three');
      this.route('four');
    });

    // Manifest it.
    let router = this.container.lookup('router:main');
    router.setupRouter();
  }
});

test('Functions correctly.', function(assert) {
  assert.expect(5);

  this.render(hbs`{{#fast-link-to 'one' 12}}Link Text{{/fast-link-to}}`);
  assert.equal(this.$().text().trim(), 'Link Text', "Passes through yield.");
  assert.equal(this.$('a').attr('href'), '/one/12', 'Generates href properly with query params.');

  this.render(hbs`{{#fast-link-to 'four'}}Link Text{{/fast-link-to}}`);
  assert.equal(this.$('a').attr('href'), '/four', 'Generates href properly without query params.');

  this.render(hbs`{{#fast-link-to 'four' id="asdf"}}Link Text{{/fast-link-to}}`);
  assert.equal(this.$('a').attr('id'), 'asdf', 'Allows override of ID.');

  this.set('nullmodel', null);
  this.render(hbs`{{#fast-link-to 'one' nullmodel}}Link Text{{/fast-link-to}}`);
  assert.equal(this.$('a').attr('class').split(' ').sort().join(' '), 'ember-view loading', 'Enters loading state with null model.');
});
