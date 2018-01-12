var analyze = require('commonform-analyze')

module.exports = function (form) {
  var analysis = analyze(form)
  var uses = analysis.uses
  var definitions = analysis.definitions

  var errors = []

  Object.keys(uses).forEach(function (term) {
    uses[term].forEach(function (usePath) {
      var hasDefinition = (
        definitions[term] &&
        definitions[term].some(function (definitionPath) {
          var parent = usePath.slice(0, -5)
          return (
            sameArray(
              parent,
              definitionPath.slice(0, parent.length)
            ) &&
            (
              // Definition is in the content array of the parent.
              definitionPath.length === parent.length + 2 ||
              // Definition is in a child in the content array.
              definitionPath.length === parent.length + 5
            )
          )
        })
      )
      if (!hasDefinition) {
        errors.push({
          message: 'The term "' + term + '" is used, but not defined.',
          level: 'error',
          path: usePath,
          source: 'commonform-check-lexical',
          url: null
        })
      }
    })
  })

  Object.keys(definitions).forEach(function (term) {
    var definitionPaths = definitions[term]
    if (definitionPaths.length !== 1) {
      definitionPaths.forEach(function (path, index) {
        var colliding = definitionPaths
          .some(function (otherPath, otherIndex) {
            if (index === otherIndex) return false
            return sameArray(path.slice(0, -1), otherPath.slice(0, -1))
          })
        if (colliding) {
          errors.push({
            message: 'The term "' + term + '" is defined more than once.',
            level: 'error',
            path: path,
            source: 'commonform-check-lexical',
            url: null
          })
        }
      })
    }
  })

  return errors
}

function sameArray (a, b) {
  return (
    a.length === b.length &&
    a.every(function (element, index) {
      return element === b[index]
    })
  )
}
