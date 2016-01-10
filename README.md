# gulp-minify-cssnames
> Gulp plugin for minify css classes and css ids

## Usage
Minifying all names(class, id) with some postfix (default: '--s--').

### Example
We have css file:

```css
.menu--s-- {color: red;}
.menu_top--s-- {color: black;}
.menu__item--s-- {color: green;}
.menu__item_active--s-- {color: blue;}
.menu__item_active--s--::before {content: 'active'}
```

```javascript
var gulp = require('gulp');
var gulp-minify-cssnames = require('gulp-minify-cssnames');

gulp.task('minify-css-names', function() {
    return gulp.src(['src/*.css'])
        .pipe(gulp-minify-cssnames())
        .pipe(gulp.dest('build'))
})
```

#### Result
```css
.a0 {color: red;}
.a1 {color: black;}
.a2 {color: green;}
.a3 {color: blue;}
.a3::before {content: 'active'}
```

### Example2
Our project has 3 files:

##### style.css
```css
.menu--s-- {color: red;}
.menu_top--s-- {color: black;}
.menu__item--s-- {color: green;}
.menu__item_active--s-- {color: blue;}
.menu__item_active--s--::before {content: 'active'}
```

##### index.html
```html
<div class="menu--s--" id="main-menu--s--">
    <div class="menu__item--s--">1</div>
    <div class="menu__item--s--">2</div>
    <div class="menu__item--s-- .menu__item_active--s--">3</div>
</div>
```
##### app.js
```javascript
var $menuItems =  document.querySelectorAll('.menu__item--s--');
var $mainMenu = document.querySelector('#main-menu--s--');
```

##### Gulp task
```javascript
var gulp = require('gulp');
var gulp-minify-cssnames = require('gulp-minify-cssnames');

gulp.task('minify-css-names', function() {
    return gulp.src(['src/style.css', 'src/index.html', 'src/app.js'])
        .pipe(gulp-minify-cssnames())
        .pipe(gulp.dest('build'))
})
```

#### Result
style.css
```css
.a0 {color: red;}
.a1 {color: black;}
.a2 {color: green;}
.a3 {color: blue;}
.a3::before {content: 'active'}
```
index.html
```html
<div class="a0" id="a4">
    <div class="a2">1</div>
    <div class="a2">2</div>
    <div class="a2 a3">3</div>
</div>
```
app.js
```javascript
var $menuItems = document.querySelectorAll('.a2');
var $mainMenu = document.querySelector('#a4');
```

## API
### gulp-minify-cssnames([options])

#### options
Type: `Object`

##### options.postfix
Type: `String`  
Default: `--s--`  

Alternative postfix for css names
