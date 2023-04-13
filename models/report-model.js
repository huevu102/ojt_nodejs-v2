const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  totalUser: {type: Number},
  type: {type: String, require: true},
  time: {type: Number, require: true}
}, {
  timestamps: true
});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;
