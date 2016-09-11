/**
 * zip and unzip module
 *
 * @author bian
 * @createDate 2016.9.9
 */
var fs = require("fs");
var path = require("path");

/**
 * zip file or directories
 * @param paths  The absolute path of file or directory,it can be an array
 * @param options [dir,name,filter,encoding]
 * @param callback(absolute path of directory and file)
 */
exports.zip = function (paths, options, callback) {
    var zip = new require("node-zip")();

    if (!Array.isArray(paths)) {     // if paths is not an array
        paths = [paths];            // wrap it as array
    }

    options = {
            dir: options.dir || process.cwd(),
            name: options.name || "out",
            filter: options.filter || false,
            encoding: options.encoding || "utf8"
        };

    if (!options.hasOwnProperty("name")         // check options
        || !options.hasOwnProperty("filter")
        || !options.hasOwnProperty("dir")
        || !options.hasOwnProperty("encoding")) {
        throw new Error("options is invalid");
    }

    /**
     * read file or directory in paths array
     * @param p
     */
    var read = function (p) {
        if (fs.statSync(p).isDirectory()) {        // read directory
            readDir(p);
        } else {                                  // read file
            readFile(p);
        }
    };

    /**
     * read directory recursively
     * @param p  absolute path
     * @param z  zip instance
     */
    var readDir = function (p, z) {
        z = z || zip.folder(path.basename(p));

        fs
            .readdirSync(p)
            .filter((e) => {            // filter file by callback
                if (options.filter && callback) {
                    return callback(path.join(p, e));
                }
                return true;
            }).forEach((e) => {
            var tmp = path.join(p, e);
            if (fs.statSync(tmp).isDirectory()) {
                var zt = z.folder(e);
                readDir(tmp, zt);                   // recursive
            } else {
                var fc = fs.readFileSync(tmp, {encoding: options.encoding});
                z.file(e, fc);
            }
        });
    };

    /**
     * read and add file to zip instance
     * @param p
     */
    var readFile = function (p) {
        var ext = path.basename(p);
        var fc = fs.readFileSync(p, {encoding: "utf8"});
        zip.file(ext, fc);
    };

    var pt;             // the tmp path
    for (pt of paths) {
        if (!path.isAbsolute(pt)) {
            throw new Error("path must be absolute");       // it must be the absolute path
        }
        read(pt);       // read
    }

    var data = zip.generate({base64: false, compression: "DEFLATE"});

    fs.writeFileSync(path.join(options.dir, `${options.name}.zip`), data, "binary");
};

/**
 * use fs.readFileSync to unzip small file
 * @param file
 * @param callback
 *
 * callback(isDir,filename,data)
 */
exports.unzip = function (file, callback) {
    var rd = fs.readFileSync(file, "binary");
    var z = new JSZip(rd, {base64: false, checkCRC32: true});
    var files = z.files;

    Object.keys(files).forEach((k) => {

        callback && callback(files[k].dir, files[k].name, files[k]._data);

    });

};

/**
 * unzip big file by stream to save memory
 * @param file
 * @param callback
 * @param done
 * callback(isDir,filename,data)
 */ 
exports.unzipBigFile = function (file, callback,done) {
    var rd = fs.createReadStream(file, {
        encoding: "binary"
    });
    var dt = "";

    rd.on("data", (d) => {
        dt += d;
    });

    rd.on("end", () => {
        var z = new JSZip(dt, {base64: false, checkCRC32: true});
        var files = z.files;

        Object.keys(files).forEach((k) => {

            callback || callback(files[k].dir, files[k].name, files[k]._data);

        });

        done || done();
    });

};