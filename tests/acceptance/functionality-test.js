import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | functionality');

test('navigating to a route', function(assert) {
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
  });

  click('.one');
  andThen(function() {
    assert.equal(currentURL(), '/one/12');
  });

  click('.two');
  andThen(function() {
    assert.equal(currentURL(), '/two');
  });

  click('.three');
  andThen(function() {
    assert.equal(currentURL(), '/three');
  });

  click('.four');
  andThen(function() {
    assert.equal(currentURL(), '/four');
  });
});
