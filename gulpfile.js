const {src, dest, watch, series, parallel} = require('gulp');

//css y sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//Imágenes 
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

const css = ()=> {
    //Compilar sass
    //1. identificar archivo 
       return src('./src/scss/app.scss')
            .pipe(sourcemaps.init())
        //2. compilarla 
            .pipe(sass({
                outputStyle: 'expanded'
            }) )
            .pipe(postcss([autoprefixer(), cssnano() ]) )
            .pipe(sourcemaps.write())
        //3. guardar el css
            .pipe(dest('build/css'))
}

const imagenes = (done)=> {
    src('./src/img/**/*')
        .pipe(imagemin({optimizationLevel : 3}))
        .pipe(dest('build/img'))

    done()
}

const versionWebp = ()=> {
    return src('./src/img/**/*.{png,jpg}')
        .pipe(webp())
        .pipe(dest('./build/img'))
}

const versionAvif = ()=> {
    return src('./src/img/**/*.{png,jpg}')
    .pipe(avif())
    .pipe(dest('./build/img'))
}
const dev = ()=> {
    watch('./src/scss/**/*.scss', css)
    watch('./src/img/**/*', imagenes)
}
exports.css = css
exports.imagenes = imagenes
exports.dev = dev
exports.versionWebp = versionWebp
exports.versionAvif = versionAvif

//series - se inicia una tarea y se inicia la siguiente luego de que finalice la anterior
exports.default = series(imagenes, versionWebp, versionAvif,  css, dev)
//parallel - todas se inician al mismo tiempo
// exports.default = parallel(css, dev)