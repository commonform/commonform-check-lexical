```javascript
var check = require('commonform-check-lexical')
var assert = require('assert')
```

## Conflicting Definitions

```javascript
assert.deepEqual(
  check({
    content: [
      {definition: 'Agreement'}, ' ',
      {definition: 'Agreement'}, ' ',
      {definition: 'Consideration'}, ' ',
      {use: 'Agreement'}, ' ',
      {use: 'Agreement'}, ' ',
      {use: 'Consideration'}, ' ',
      {use: 'Consideration'}
    ]
  }),
  [
    {
      message: 'The term "Agreement" is defined more than once.',
      level: 'error',
      path: ['content', 0],
      source: 'commonform-check-lexical',
      url: null
    },
    {
      message: 'The term "Agreement" is defined more than once.',
      level: 'error',
      path: ['content', 2],
      source: 'commonform-check-lexical',
      url: null
    }
  ],
  'notes multiple definitions of the same term'
)
```

## Undefined Terms

```javascript
assert.deepEqual(
  check({content: [{use: 'Agreement'}]}),
  [
    {
      message: 'The term "Agreement" is used, but not defined.',
      level: 'error',
      path: ['content', 0],
      source: 'commonform-check-lexical',
      url: null
    }
  ],
  'reports the use of an undefined term'
)

assert.deepEqual(
  check({
    content: [
      {form: {content: [{form: {content: [{definition: 'X'}]}}]}},
      {form: {content: [{use: 'X'}]}}
    ]
  }),
  [
    {
      message: 'The term "X" is used, but not defined.',
      level: 'error',
      path: ['content', 1, 'form', 'content', 0],
      source: 'commonform-check-lexical',
      url: null
    }
  ],
  'reports the use of an undefined term'
)

assert.deepEqual(
  check({
    content: [
      {form: {content: [{definition: 'X'}]}},
      {form: {content: [{use: 'X'}]}}
    ]
  }),
  [],
  'identifies definition in sibling content'
)

assert.deepEqual(
  check({
    content: [
      {definition: 'X'},
      {form: {content: [{use: 'X'}]}}
    ]
  }),
  [],
  'identifies definition in parent content'
)

assert.deepEqual(
  check({content: [{use: 'Agreement'}, {use: 'Agreement'}]}),
  [
    {
      message: 'The term "Agreement" is used, but not defined.',
      level: 'error',
      path: ['content', 0],
      source: 'commonform-check-lexical',
      url: null
    },
    {
      message: 'The term "Agreement" is used, but not defined.',
      level: 'error',
      path: ['content', 1],
      source: 'commonform-check-lexical',
      url: null
    }
  ],
  'notes multiple uses of an undefined term'
)
```
