const OptionChainModel = require('../models/optionChainModel');

exports.getOptionChain = (req, res) => {
  res.json(OptionChainModel.initialData);
};