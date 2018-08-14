const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const app = express()
var upload = multer()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {

})

app.post('/' + 'upload', upload.single('file'), function(req, res) {
    res.status(200).send(
        parseTextToJSON(req.file.buffer.toString())
    )
})

app.listen(process.env.PORT || 5000, function() {
    console.log('Listening...')
})

function parseTextToJSON(text) {
    let data = text.split('\n'),

        parsedData = []

    parsed = {
            "header": {
                "names": {},
                "dates": {
                    "requestedShipDate": [],
                    "purchaseOrderDate": []
                }
            },
            "body": [],
            "summary": {}
        },
        lx = 0,
        typeOf = null;

    data.forEach(segment => {
        let seg = segment.replace(/\r/g , '').split('|');
        let seg_id = seg[0];
        seg.shift(); // Remove firsts

        if (['ISA', 'GS', 'ST', 'NTE', 'W66', 'W05'].indexOf(seg_id) != -1) {
            parsed['header'][seg_id] = seg
        } else if (['N1', 'N2', 'N3', 'N4'].indexOf(seg_id) != -1) {
            if (seg_id == 'N1') {
                typeOf = seg[0]
                parsed['header']['names'][typeOf] = {}
            }
            parsed['header']['names'][typeOf][seg_id] = seg
        }
        else if (['HL'].indexOf(seg_id) != -1) {
            if (seg_id == 'HL' && !parsed['header']['names'][seg_id]) {
                parsed['header']['names'][seg_id] = []
            }
            parsed['header']['names'][seg_id].push(seg)
        } else if (seg_id == 'G62') {
            if (parsed['header']['dates']['requestedShipDate'].length == 0)
                parsed['header']['dates']['requestedShipDate'] = seg
            else
                parsed['header']['dates']['purchaseOrderDate'] = seg
        } else if (['W76', 'SE', 'GE', 'IEA'].indexOf(seg_id) != -1) {
            parsed['summary'][seg_id] = seg;
            if (seg_id == 'SE') {
                parsedData.push(parsed)
                parsed = {
                    "header": {
                        "names": {},
                        "dates": {
                            "requestedShipDate": [],
                            "purchaseOrderDate": []
                        }
                    },
                    "body": [],
                    "summary": {}
                }
            }
        } else {
            if (seg_id == 'N9' && !parsed['header']['N9'])
                parsed['header'][seg_id] = seg
            else {
                if (seg_id == 'LX')
                    lx = (parseInt(seg[0]) - 1);
                else {
                    if (parsed['body'][lx])
                        parsed['body'][lx][seg_id] = seg;
                    else
                        parsed['body'].push({
                            [seg_id]: seg
                        });
                }
            }
        }
    });

    // fs.writeFileSync('result.txt', Buffer.from(JSON.stringify(parsedData, null, 2)));

    return parsedData;
}