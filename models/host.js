const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hostSchema = new Schema({
  tenantId: {
    type: String,
    required: true
  },
  host: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Host', hostSchema)