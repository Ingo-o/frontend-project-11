const path = require('path');

module.exports = {
  entry: './index.html',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
