/**
 * test file of zip module
 *
 * @author mrbian
 * @createDate 2016.9.10
 */
var should = require("should");
var path = require("path");
var fs = require("fs");
var os = require("os");

var nodeJsZip = require("..");

var testDir = path.join(__dirname,"./directory");
var testFile = path.join(__dirname,"./file.js");

describe("test zip and unzip",function(){
    it("zip a file without filter should work ok",function(){
        nodeJsZip.zip([testDir,testFile],{
            name : "test1",
            dir : __dirname,
            filter : false
        });
        var zipPath = path.join(__dirname,"test1.zip");
        fs.statSync(zipPath);

        fs.unlink(zipPath);
    });

    it("zip a file with filter include should work ok",function(){
        var include = [path.join(__dirname,"./directory/a.js")];

        nodeJsZip.zip([testDir,testFile],{
            name : "test2",
            dir : __dirname,
            filter : true
        },function(p){
            return include.indexOf(p) !== -1;
        });

        var zipPath = path.join(__dirname,"test2.zip");
        fs.statSync(zipPath);

        fs.unlink(zipPath);
    });

    it("zip a file with filter exclude should work ok",function(){
        var exclude = [path.join(__dirname,"directory/dir1")];

        nodeJsZip.zip([testDir,testFile],{
            name : "test3",
            dir : __dirname,
            filter : true
        },function(p){
            return exclude.indexOf(p) === -1;
        });

        var zipPath = path.join(__dirname,"test3.zip");
        fs.statSync(zipPath);

        fs.unlink(zipPath);
    });

    it("unzip a file should work ok",function(){
        var root = path.join(process.cwd(),"./zip.test");
        fs.mkdirSync(root);

        nodeJsZip.unzip(path.join(__dirname,"./demo.zip"),function(isDir,name,data){
            if(isDir){
                fs.mkdirSync(path.join(root,name));
            }else{
                // if(name === ""){      // filter some file here
                //     return;
                // }
                fs.writeFileSync(path.join(root,name),data);
            }
        });

        fs.statSync(path.join(root,"./a"));
        fs.statSync(path.join(root,"./b"));
        fs.statSync(path.join(root,"./c.js"));

        fs
            .readdirSync(root)
            .forEach((e) => {
                var p = path.join(root,e);
                fs.stat().isDirectory() ? fs.unlinkSync(p) : fs.rmdirSync(p);
            });
    });
});