'use strict';

const fs = require('fs');
const concatStream = require('concat-stream');
const gulp = require('gulp');
const expect = require('chai').expect;
const streamAssert = require('stream-assert');
const File = require('vinyl');
const minify = require('../');

describe('gulp-minify-cssnames', () => {
    describe('Replace CSS names', () => {
        it('should work with buffer', (done) => {
            let stream = minify();
            let file = new File({
                path: 'test/fixtures/style.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/style.css')
            });

            stream.on('data', (file) => {
                expect(String(file.contents)).to.equal(fs.readFileSync('test/result/style.css', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });

        it('should work with stream', (done) => {
            let stream = minify();
            let file = new File({
                path: 'test/fixtures/style.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.createReadStream('test/fixtures/style.css')
            });

            stream.on('data', (file) => {
                file.contents.pipe(concatStream({encoding: 'string'}, (data) => {
                    expect(data).to.equal(fs.readFileSync('test/result/style.css', 'utf8'));
                    done();
                }));
            });

            stream.write(file);
            stream.end();
        });

        it('should work with buffer (alternative postfix)', (done) => {
            let stream = minify({postfix: '--alt-postfix--'});
            let file = new File({
                path: 'test/fixtures/style.alt-postfix.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync('test/fixtures/style.alt-postfix.css')
            });

            stream.on('data', (file) => {
                expect(String(file.contents)).to.equal(fs.readFileSync('test/result/style.alt-postfix.css', 'utf8'));
                done();
            });

            stream.write(file);
            stream.end();
        });

        it('should work with stream (alternative postfix)', (done) => {
            let stream = minify({postfix: '--alt-postfix--'});
            let file = new File({
                path: 'test/fixtures/style.alt-postfix.css',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.createReadStream('test/fixtures/style.alt-postfix.css')
            });

            stream.on('data', (file) => {
                file.contents.pipe(concatStream({encoding: 'string'}, (data) => {
                    expect(data).to.equal(fs.readFileSync('test/result/style.alt-postfix.css', 'utf8'));
                    done();
                }));
            });

            stream.write(file);
            stream.end();
        });

        it('should work with group files in real Gulp', (done) => {
            let files = ['test/fixtures/group/app.js', 'test/fixtures/group/style.css', 'test/fixtures/group/index.html'];
            let count = files.length;
            let stream = gulp.src(files)
                .pipe(minify())
                .pipe(streamAssert.length(count));

            files.forEach((item, index) => {
                stream = stream.pipe(streamAssert.nth(index, (d) => {
                    expect(String(d.contents)).to.equal(fs.readFileSync(item.replace('fixtures', 'result'), 'utf8'));
                    if (--count === 0) {
                        done();
                    }
                }));
            });
        });

        it('should work with group files in real Gulp (stream)', (done) => {
            let files = ['test/fixtures/group/app.js', 'test/fixtures/group/style.css', 'test/fixtures/group/index.html'];
            let count = files.length;
            let stream = gulp.src(files, {buffer: false})
                .pipe(minify())
                .pipe(streamAssert.length(count));

            files.forEach((item, index) => {
                stream = stream.pipe(streamAssert.nth(index, (d) => {
                    d.contents.pipe(concatStream({encoding: 'string'}, (data) => {
                        expect(data).to.equal(fs.readFileSync(item.replace('fixtures', 'result'), 'utf8'));
                        if (--count === 0) {
                            done();
                        }
                    }));
                }));
            });
        });
    });

});
