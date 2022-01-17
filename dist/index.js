
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./defione-sdk.cjs.production.min.js')
} else {
  module.exports = require('./defione-sdk.cjs.development.js')
}
