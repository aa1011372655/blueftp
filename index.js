/**
 * 增加gulp-ftp的拓展，可以在remotePath中写数组
 */
'use strict';
// 路径设置插件
var path = require('path');
// gulp通用函数
var gutil = require('gulp-util');
// 流处理插件
var through = require('through2');
// jsftp插件
var JSFtp = require('jsftp');
// ftp文件目录处理拓展
JSFtp = require('jsftp-mkdirp')(JSFtp);
// 主类实现
module.exports = function (options) {
    // 判断是否设置了主机地址
    if (options.host === undefined) {
        throw new gutil.PluginError('gulp-ftp', 'host required！！！');
    }
    // 上传文件个数索引
    var fileCount = 0;
    // 获取上传地址，可以是字符串或者数组
    var remotePath = options.remotePath;
    // 判断是否有上传目录路径
    if (!remotePath) {
        throw new gutil.PluginError('gulp-ftp', 'remotePath required！！！');
    }
    // 删除属性，因为jsftp不接受多余的对象属性
    delete options.remotePath;
    // 流处理
    return through.obj(function (file, enc, cb) {
        // 如果src获取的文件是空，提示
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        // 如果文件是一个流，不是gulp常用的vinyl 文件对象流，提示
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-ftp', 'Streaming not supported'));
            return;
        }
        // 初始化ftp
        var ftp = new JSFtp(options);
        // 设置最后的上传目录路径
        var finalRemotePath;
        // 是数组则根据文件个数索引设置上传目录路径
        if (typeof remotePath !== 'string') {
            finalRemotePath = path.join('/', remotePath[fileCount], file.relative).replace(/\\/g, '/');
        } else {
            finalRemotePath = path.join('/', remotePath, file.relative).replace(/\\/g, '/');
        }
        // ftp目录操作,建立ftp链接
        ftp.mkdirp(path.dirname(finalRemotePath).replace(/\\/g, '/'), function (err) {
            // 错误提示
            if (err) {
                cb(new gutil.PluginError('gulp-blueftp', err, {fileName: file.path}));
                return;
            }
            // 将文件上传到指定该目录
            ftp.put(file.contents, finalRemotePath, function (err) {
                // 错误提示
                if (err) {
                    cb(new gutil.PluginError('gulp-blueftp', err, {fileName: file.path}));
                    return;
                }
                // 上传成功文件个数索引加一
                fileCount++;
                // 结束此次目录链接
                ftp.raw.quit();
                cb(null, file);
            });
        });
    }, function (cb) {
        // 执行完毕后判断是否有文件上传并给出提示
        if (fileCount > 0) {
            gutil.log('gulp-ftp:', gutil.colors.green('uploaded successfully'));
        } else {
            gutil.log('gulp-ftp:', gutil.colors.yellow('No files uploaded'));
        }
        cb();
    });
};
