#nodejs-zip

nodejs-zip

```nodeJsZip.zip``` and ```nodeJsZip.unzip``` is sync function

## Installation
```
npm install nodejs-zip --save
```

## Usage

zip a file 
```
var nodeJsZip = require("nodejs-zip");

var file = path.join(__dirname,"./file.js");

nodeJsZip.zip(file);
```

zip a directory
```
var nodeJsZip = require("nodejs-zip");

var dir = path.join(__dirname,"./directory");

nodeJsZip.zip(dir);
```

Zip file and directory
```
var nodeJsZip = require("nodejs-zip");

var dir = path.join(__dirname,"./directory");
var file = path.join(__dirname,"./file.js");

nodeJsZip.zip([dir,file]);
```

unzip 
```
var callback = function(isDir,name,data){
    if(isDir){
    
        // you can filter some directory here
        
        fs.mkdirSync(path.join(root,name));
    }else{
    
        // you can filter some file here
        
        fs.writeFileSync(path.join(root,name),data);
    }
}
nodeJsZip.unzip(path.join(__dirname,"./demo.zip"),callback);
```

zip file with filter
```
var nodeJsZip = require("nodejs-zip");

var dir = path.join(__dirname,"./directory");
var file = path.join(__dirname,"./file.js");

var include = [path.join(__dirname,"./directory/a.js")];
 
var filter = function(e){
    return include.indexOf(p) !== -1;
};

nodeJsZip.zip([dir,file],{
            name : "test1",             
            dir : __dirname,            
            filter : false             
},filter);
```
## API
### nodeJsZip.zip
-   ```nodeJsZip.zip(file)```
-   ```nodeJsZip.zip(dir)```
-   ```nodeJsZip.zip([file,dir,...])```
-   ```nodeJsZip.zip([file,dir,...],options,callback)```

#### ```[file,dir]```
The path of file or dir must be absolute path

#### ```options``` object properties

| Property  | Default| Description|
|---|---|------|
|  dir | process.cwd() | the dir of output zip file |
|  name | out | the name of output zip file |
|  filter | false | is filter file in directory to exclude some files in directory |
|  encoding | utf8 | the encoding of text file to zip |


#### ```callback(path)```
- ```path``` 
The absolute path of the files in the directory which is going to be compressed

- return
return true to include the file or directory,return false to exclude the file or directory


### nodeJsZip.unzip
Traverse all files and directory in zip file in order

- ```nodeJsZip.unzip(file,callback)```

#### file 
the absolute path of a zip file which is going to be uncompressed

#### ```callback(isDir,name,data)```
- isDir 
true or false, 
- name
the name of a file or directory in zip file
- data
if it is a file , the binary data of file 

### nodeJsZip.unzipBigFile
Async unzip a big file , this function use ```fs.createReadStream``` not ```fs.readFileSync``` to save memory

#### file
the absolute path of a zip file which is going to be uncompressed

#### ```callback(isDir,name,data)```
- isDir 
true or false, 
- name
the name of a file or directory in zip file
- data
if it is a file , the binary data of file 

#### done()
the function which will be forked when the unzip process is done

## IDE
![WebStorm](https://confluence.jetbrains.com/download/thumbnails/51943829/WebStorm_400x400_Twitter_logo_white.png?version=1&modificationDate=1451316090000&api=v2)

## LICENSE
The MIT License (MIT)

Copyright (c) 2016 mrbian

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.