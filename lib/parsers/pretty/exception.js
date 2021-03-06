const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const Gherkin = require('gherkin');
const parser = new Gherkin.Parser();

const colorMap = require('../../../data/cucumber-color-map');
const colorize = require('../../../utils/unix').colorize;
const indent = require('../../../utils/unix').indent;
const buffer = require('../../../utils/unix').buffer;

var testData = require('../../../data/tracking-data');

module.exports = function(filename, exception) {
  var file = fs.readFileSync(filename, {encoding: 'utf8'});
  var feature = parser.parse(file);

  buffer.log('Feature: ' + feature.name);

  var scenario = feature.scenarioDefinitions.pop();
  if (scenario.tags) {
    var tagsArray = _.map(scenario.tags, 'name');
    buffer.log(colorize(indent(1) + tagsArray.join(' '), colorMap.tag));
  }

  buffer.log(indent(1) + 'Scenario: ' + scenario.name);
  buffer.log(colorize(indent(1) + exception.stack, 'red'));

  testData.scenarioStatuses.failed++;
  testData.failedScenarios.push(path.basename(filename) + ':' + scenario.line + ' # ' + scenario.name);

  return {
    data: testData,
    output: buffer.dump()
  };
};
