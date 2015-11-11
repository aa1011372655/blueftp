# gulp-blueftp

## 安装方法

```
$ npm install --save-dev gulp-blueftp
```


## 使用方法

```js
var gulp = require('gulp');
var gutil = require('gulp-util');
var ftp = require('gulp-ftp');
var src=['jslib/modules/index/main.js','jslib/search/search.js']
var ftpConfig={
			host: 'xxx.xxx.com',
			user: 'xxx',
			pass: 'xxx',
			remotePath:['jslib/modules/index/','jslib/search/']
		}

gulp.task('default', function () {
	return gulp.src(src).pipe(ftp(ftpConfig)).pipe(gutil.noop());
});
```


## API

### ftp(options)

#### options.host（ftp主机地址）

*Required*  
Type: `string`

#### options.port（ftp端口）

Type: `number`  
Default: `21`

#### options.user（ftp用户名）

Type: `string`  
Default: `'anonymous'`

#### options.pass（ftp密码）

Type: `string`  
Default: `'@anonymous'`

#### options.remotePath（上传到ftp的目录路径）

Type: `string or array`  
Default: `'/'`
