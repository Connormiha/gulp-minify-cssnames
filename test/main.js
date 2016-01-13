'use strict';

var fs = require('fs');
var concatStream = require('concat-stream');
var gulp = require('gulp');
var expect = require('chai').expect;
var streamAssert = require('stream-assert');
var File = require('vinyl');
var minify = require('../');

describe('gulp-minify-cssnames', function() {
    describe('Replace CSS names', function() {
        it('Should work with buffer', function(done) {
            var stream = minify();
            var file = new File({
                path: 'test/fixtures/style.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/style.css')
            });

            stream.on('data', function(file) {
                expect(String(file.contents)).to.equal(fs.readFileSync('test/result/style.css', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });

        it('Should work with stream', function(done) {
            var stream = minify();
            var file = new File({
                path: 'test/fixtures/style.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.createReadStream('test/fixtures/style.css')
            });

            stream.on('data', function(file) {
                file.contents.pipe(concatStream({encoding: 'string'}, function(data) {
                    expect(data).to.equal(fs.readFileSync('test/result/style.css', 'utf8'));
                    done();
                }));
            });

            stream.write(file);
            stream.end();
        });

        it('Should work with buffer (alternative postfix)', function(done) {
            var stream = minify({postfix: '--alt-postfix--'});
            var file = new File({
                path: 'test/fixtures/style.alt-postfix.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/style.alt-postfix.css')
            });

            stream.on('data', function(file) {
                expect(String(file.contents)).to.equal(fs.readFileSync('test/result/style.alt-postfix.css', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });

        it('Should work with stream (alternative postfix)', function(done) {
            var stream = minify({postfix: '--alt-postfix--'});
            var file = new File({
                path: 'test/fixtures/style.alt-postfix.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.createReadStream('test/fixtures/style.alt-postfix.css')
            });

            stream.on('data', function(file) {
                file.contents.pipe(concatStream({encoding: 'string'}, function(data) {
                    expect(data).to.equal(fs.readFileSync('test/result/style.alt-postfix.css', 'utf8'));
                    done();
                }));
            });

            stream.write(file);
            stream.end();
        });

        it('Should work with group files in real Gulp', function(done) {
            gulp.src(['test/fixtures/group/app.js', 'test/fixtures/group/style.css', 'test/fixtures/group/index.html'])
                .pipe(minify())
                .pipe(streamAssert.length(3))
                .pipe(streamAssert.first(function(d) {
                    expect(String(d.contents)).to.equal(fs.readFileSync('test/result/group/app.js', 'utf8'));
                }))
                .pipe(streamAssert.second(function(d) {
                    expect(String(d.contents)).to.equal(fs.readFileSync('test/result/group/style.css', 'utf8'));
                }))
                .pipe(streamAssert.nth(2, function(d) {
                    expect(String(d.contents)).to.equal(fs.readFileSync('test/result/group/index.html', 'utf8'));
                }))
                .pipe(streamAssert.end(done));
        });
    });

});
