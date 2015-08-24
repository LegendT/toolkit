'use strict';

var fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    // Processes
    eslint = require('eslint'),
    // Helpers
    log = require('./helpers/log');

module.exports = function(paths, options) {
    return new Promise(function(resolve) {
        log.title('lint:js');
        log('Loading ESLint configuration...');

        var engine = new eslint.CLIEngine({
            configFile: path.join(process.cwd(), '.eslintrc')
        });

        log('Linting files...');

        resolve(engine.executeOnFiles(paths));
    })

    // Display the report
    .then(function(report) {
        if (report.errorCount === 0 && report.warningCount === 0) {
            log.success('JavaScript linted');
            return report;
        }

        if (report.warningCount) {
            log.warn(report.warningCount + ' warnings detected');
        }

        if (report.errorCount) {
            log.error(report.errorCount + ' errors detected');
        }

        report.results.forEach(function(result) {
            if (!result.messages.length) {
                return;
            }

            log(result.filePath, 1, 1);

            result.messages.forEach(function(message) {
                var meta = message.line + ':' + message.column + ' ' + message.ruleId,
                    msg = message.message;

                if (message.severity === 2) {
                    msg = chalk.red(msg);
                } else {
                    msg = chalk.yellow(msg);
                }

                log('[' + chalk.gray(meta) + '] ' + msg, 2);
            });
        });

        return report;
    });
};
