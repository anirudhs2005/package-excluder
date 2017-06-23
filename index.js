const xml2ObjectPromiseMaker = require('./scripts/xml2ObjectPromise');
const _ = require('underscore');
const {pd} = require("pretty-data");
const fs= require('fs');

const file1 = './package1.xml';
const file2 = './package2.xml';
const consolidatedFile = `consolidate.xml`;

//Remove whatever is there in package2.xml from package.xml

async function findFile1MinusFile2() {
    try {
        const parseResult1 = await xml2ObjectPromiseMaker({
            filePath: file1
        });
        const parseResult2 = await xml2ObjectPromiseMaker({
            filePath: file2
        });
        const data1 = parseResult1.data;
        const data2 = parseResult2.data;
        

        data2.forEach((d2, i2) => {
            const foundAt = _.findIndex(data1, {
                type: d2.type
            });
            if (foundAt !== -1) {
                const members1 = data1[foundAt].members;
                const newMembers1 = _.without(members1, ...d2.members);
                data1[foundAt].members = newMembers1;

            }
        });
        function makeString(data){
                const str = '';
                data.forEach((d,i)=>{
                    str = `<types>\n
                                

                          </types>`
                })
        }
        const packageXMLString = `<?xml version="1.0" >
            <Package xmlns="http://soap.sforce.com/2006/04/metadata">
                 ${data1
                        .map(data=>
                                `<types>
                                    ${data.members.map(mem=>`<members>${mem}</members>`).join('')}
                                    <name>${data.type}</name>
                                </types>`

                        ).join('')}
                        <version>${parseResult1.version}</version>

            </Package>`;
        const prettyXML = pd.xml(packageXMLString);
        fs.writeFileSync(consolidatedFile,prettyXML);






    } catch (err) {
        console.log(err);
    }
}
//Start program 
findFile1MinusFile2();