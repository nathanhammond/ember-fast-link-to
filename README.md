# ember-fast-link-to

[![Build Status](https://travis-ci.org/nathanhammond/ember-fast-link-to.svg)](https://travis-ci.org/nathanhammond/ember-fast-link-to)
[![npm version](https://badge.fury.io/js/ember-fast-link-to.svg)](http://badge.fury.io/js/ember-fast-link-to)
[![Ember Observer Score](http://emberobserver.com/badges/ember-fast-link-to.svg)](http://emberobserver.com/addons/ember-fast-link-to)
[![Code Climate](https://codeclimate.com/github/nathanhammond/ember-fast-link-to/badges/gpa.svg)](https://codeclimate.com/github/nathanhammond/ember-fast-link-to)

The default implementation of `{{link-to}}` inside of Ember tries to do too much. This stripped down version does far less.

## Installation

* `ember install fast-link-to`

## Usage

```
{{#fast-link-to 'route.path' model}}Link Text{{/fast-link-to}}
```

## Running Tests

* `git clone` this repository
* `npm install`
* `bower install`
* `npm test` (Runs `ember try:testall` to test against multiple Ember versions)
