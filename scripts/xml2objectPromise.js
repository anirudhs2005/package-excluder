const xml2object = require('xml2object'),
    fs = require('fs');

function xmlReader(tags, filePath,resolve,reject) {
    let xmlReadResult = {
            filePath,
            data: [],
            version: ''
     };
    try {
        let source = fs.createReadStream(filePath);
        let parser = new xml2object(tags, source);
        parser.on('object', (name, obj) => {
            if (name === 'types') {
                let {
                    members,
                    name: type

                } = obj;
                //If there is only a single member, then a string is returned.
                //Converting it to array
                if (typeof members === 'string') {
                    members = [members];
                }
                xmlReadResult.data.push({
                    type,
                    members
                })
            }
            if (name === 'version') {
                xmlReadResult.version = obj.$t;
            }



        });
        parser.on('end', () => {
            resolve(xmlReadResult);
        });
        parser.start();
    } catch (err) {
        reject(err);
    }
}

function xml2ObjectPromiseMaker({tags=['types','version'],filePath,customParser=xmlReader}) {
    
    let xml2objectPromise = new Promise(function(resolve, reject) {
         
         customParser(tags,filePath, resolve, reject);     

    });

    return xml2objectPromise;
}

module.exports = xml2ObjectPromiseMaker;