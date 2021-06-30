
// Это ряд переменных и присвоим им пути
// к файлам и папкам проекта

// это делается для того, чтобы когда нам
// захочется поменять название папок нам не пришлось
// делать это по всему галп файлу

let project_folder="dist"; // папка вывода заказчкику
let source_folder="#src";  // папка ввода наша

// project_folder это название переменной




// Создаём переменную path, которая содержит в себе
// объект, которые содержат в себе различные пути 
// к файлам и папкам

// Первые объект это build - здесь хранятся пути
// вывода т.е пути куда галп будет выгружатьобработ-ые
// файлы первый путь это будет путь к html и тд
// 
// project_folder = #src/css/style.css или .js, .html
// /fonts/*.ttf - * = любоё имя главное что формат ttf
// ** - все подпапки * - с любым именем

let path = {
    build: {
        html: project_folder + "/", // не указываем папку так он у нас и так в корне
        css: project_folder + "/css", // тут нужна папка
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", '!'+source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss", // Меняем папку css на scss
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: { //нужно слушать постоянно и отлавливать изменения
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}", // все форматы которые нужно проверять
    }, // Шрифты смотреть не надо
    

    /* Мы создаём ещё один объект который содержит путь
     к папке проекта этот объект отвечает за удаление
     этой папки каждый раз когда мы запускает галп
     */
   clean: "./" + project_folder + "/",
}





// Здесь src, dest присваевается сам gulp
let { src, dest } = require('gulp'),
    /*Здесь я создал переменную присваевоил сам gulp
     Дальше этот список переменных будет увеличивываться
     Помере того как мы будем устанавливатьб новые
     плагины и дополнения*/
    gulp          = require('gulp'),
    browsersync   = require("browser-sync").create(), // Обновляет нашу страницу - скачиваем через терминиал npm i browser-sync --save-dev
    fileinclude   = require("gulp-file-include"), // Собриает наш сайт по частям header,products,main,footer - скачиваем через терминиал npm i browser-sync --save-dev
    del           = require("del"), // Удаляет все лишние папки из dist - скачиваем через терминиал npm i del --save-dev
    scss          = require('gulp-sass'), // Ставит проблемы где надо, чтобы улучшить читаемость кода, и ещё чтобы он обрабатывался и генерировался в файл css, который понятен браузеру
    autoprefixer  = require('gulp-autoprefixer'), // добавляет хернюшки, чтобы улучшить кроусбраузерность --dev-flex такие вещи
    group_media   = require('gulp-group-css-media-queries'), // группирует и распределяет медиа запросы, чтобы не было на сайте 3 запроса по 767, также чтобы не был нарушен порядок сначала 767 затем 480, а не наоборот
    clean_css     = require('gulp-clean-css'), // сжимает css
    rename        = require('gulp-rename'), // добавляет .min.css к названию, не файл добавляет а название, но способтвует созданию потому, что 2 раза выгружаешь в dist
    uglify        = require('gulp-uglify-es').default, // Специальный плагин для сжатия js
    babel = require('gulp-babel'), // Переводит современный синтаксис es6 в старый синтаксис es5
    imagemin = require('gulp-imagemin'), // сжимает images
    ttf2woff = require('gulp-ttf2woff'), // делает любые шрифты вофф и вофф2
    ttf2woff2 = require('gulp-ttf2woff2')

function browserSync(params) { // это у него не самописная штука, он взял её из документации
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/", // смотрят за этой папкой
        },
        port: 3000,   // Покапался и нашёл эти две штуки
        notify:false // порт - это хрень по которой открывается браузер, нотифай это хрень сообщающая, что страница обновлена
    })
}

function html() {
    return src(path.src.html) // Мы обратились объекту path который содержить в себе ещё один объект src и к значению html
    .pipe(fileinclude())
    .pipe(dest(path.build.html)) // Мы перебросим из исходной папки в папку назначения которую дадим заказчику и ищем черз объект результат build
    .pipe(browsersync.stream()) // нужно так писать по документации читай документацию


    /* pipe это функция в которой мы пишем те или иные
     функции для gulp */
}

function css() {
    return src(path.src.css) // Под css мы указываем path src css: source_folder даже если там написано scss
    .pipe(scss({
        outputStyle: 'expanded'
    }))
    .pipe(group_media())
    .pipe(autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(rename({
        extname: ".min.css"
    }))
    .pipe(dest(path.build.css)) // include нам здесь не нужен так как препроцессоры css и без этого подключать внешние файлы
    .pipe(browsersync.stream())
} /* Результом функции css будет банальное копирование файла scss в нашу папочку dist,
но  это мне не нужно мне нужно, чтобы он обрабатывался и генерировался в файл css, который понятен браузеру
для этого мы установим новый плагин npm i gulp-sass --save-dev
*/

function js() {
    return src(path.src.js) 
    .pipe(fileinclude())
    .pipe(dest(path.build.js)) 
    .pipe(babel({
        presets: ['@babel/env'] // Это готовые плагины для работы
    }))
    .pipe(uglify())
    .pipe(rename({
        extname: ".min.js"
    }))
    .pipe(dest(path.build.js)) 
    .pipe(browsersync.stream()) 


    /* pipe это функция в которой мы пишем те или иные
     функции для gulp */
}

const images = () => {
    return src('#src/images/**/*')
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 75, progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest('dist/images'))
    .pipe(browsersync.stream())
}

const fonts = () => {
    src('#src/fonts/**.ttf')
        .pipe(ttf2woff())
        .pipe(dest('./dist/fonts/'))
    return src('#src/fonts/**.ttf')
        .pipe(ttf2woff2())
        .pipe(dest('./dist/fonts/'))
}

const libs = () => {
    src('#src/libs/*.js')
        .pipe(dest('dist/libs'))
        .pipe(browsersync.stream())
}

const libsCss = () => {
    src('#src/css-libs/**.css')
        .pipe(dest('dist/css-libs'))
        .pipe(browsersync.stream())
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html); // Здесь происходит только слежка за html
    gulp.watch([path.watch.css], css); // здесь scss
    gulp.watch([path.watch.js], js);  // здесь js
    gulp.watch([path.watch.img], images);
    gulp.watch('#src/fonts/**.ttf', fonts);
    gulp.watch('#src/libs/*.js', libs);
    gulp.watch('#src/css-libs/*.css', libsCss);
} // watch который написан вот здесь gulp.watch это из объекта path
// После массива идёт функция html

function clean(params){
   return del(path.clean);
}

// отвечает за последовательность команд html clean итд

let build = gulp.series(clean, gulp.parallel(js,libs, images, libsCss, css, html, fonts)) // gulp.parallel(css,html) сделали, чтобы они работали вместе, одновременно
let watch = gulp.parallel(build, watchFiles, browserSync);
// Смотри за галп и паралельно запусти функцию build,browserSync

// watch из объета path
exports.js = js;
exports.libs = libs;
exports.libsCss = libsCss;
exports.css = css;
exports.html = html;
exports.images = images;
exports.fonts = fonts;
exports.build = build;


// Подружить gulp с переменной watch это делается так
// default = gulp
// Теперь gulp включает себя watch
exports.watch = watch;
exports.default = watch; // exports это объект NodeJs
// Т.е когда мы запускаем gulp запускается watch который 
// запускает browserSync
