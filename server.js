const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const app = express()
var upload = multer()

var tripleDES = require('nod3des')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// https://www.sslshopper.com/ssl-converter.html
// https://8gwifi.org/PemParserFunctions.jsp
// https://www.nsoftware.com/kb/articles/as2.rst
// https://www.certlogik.com/decoder/

// https://www.kevinleary.net/self-signed-trusted-certificates-node-js-express-js/

// https://www.sslshopper.com/certificate-decoder.html
// https://dzone.com/articles/getting-started-with-as2-protocol-using-as2gateway
// https://www.goanywhere.com/managed-file-transfer/more/tutorials/how-to-send-as2-messages
// https://www.ld.com/as2-part-3-certificates/
// https://docs.oracle.com/cd/E57990_01/pt853pbh2/eng/pt/tiba/task_WorkingWiththeAS2Connectors-fe7ed2.html#topofpage


// AS2 Id : MCKTEST
// URL: http://as2.rxcrossroads.com:5080/as2
// Protocol : HTTP
// Encryption algorithm: Triple DES
// MDN Mode:  synchronous
// IP Address: 143.112.68.106

// -----BEGIN CERTIFICATE-----
// MIIDsTCCApkCCgKJaAqLTLPDNGswDQYJKoZIhvcNAQEFBQAwgZkxCzAJBgNVBAYT
// AlVTMQswCQYDVQQIEwJLWTETMBEGA1UEBxMKTG91aXN2aWxsZTERMA8GA1UEChMI
// TWNrZXNzb24xETAPBgNVBAsTCE1ja2Vzc29uMS8wLQYJKoZIhvcNAQkBFiByYW1l
// c2gucmFtYWRvc3NAcnhjcm9zc3JvYWRzLmNvbTERMA8GA1UEAxMITUNLRVNTT04w
// HhcNMTgwNjExMjMzODIwWhcNMjQwNjExMjMzODIwWjCBmTELMAkGA1UEBhMCVVMx
// CzAJBgNVBAgTAktZMRMwEQYDVQQHEwpMb3Vpc3ZpbGxlMREwDwYDVQQKEwhNY2tl
// c3NvbjERMA8GA1UECxMITWNrZXNzb24xLzAtBgkqhkiG9w0BCQEWIHJhbWVzaC5y
// YW1hZG9zc0ByeGNyb3Nzcm9hZHMuY29tMREwDwYDVQQDEwhNQ0tFU1NPTjCCASIw
// DQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAOTN2qAwJucFAflJsp8fzVDmN+lN
// NwXNIRRHFiKcAIJv/9OBxVdHEhgFCEcVncXXtaleOP9n8zPZ8CSztl7QehIbg3NE
// Ig3SUy8eoHbiu+ePoEgT5MbCh4NUW5etH6y/7NG/BCE2iuJxmM6mXY/lFIP/cVZA
// zwt13OvVeYyc9Y9wRsdaMRU4zNRZVGHHuixKHCCWku9VCL1n1GcH1uo086CGOhGZ
// Mz+N1Oo+K8Hm9/87l/Li7q1CWvuiRMamhHToLJzEVUqoIRBlhCyPgRG5JZu6QdiD
// h/ZFyG5v/vUw5phX+aXZsz2Y8RAWy/Vm7T7WG5dgYmjgbhwWMdxkdIEAiu0CAwEA
// ATANBgkqhkiG9w0BAQUFAAOCAQEAkYIj0D7SJU7ZnZ9huyJdzwv60w+fcEkq6WwT
// caGlza8E+YhdoX7jVUWZMhzZUGHIo6oPHNmDTFTnt25UO7nHyAfi0EHdUft9HlTP
// XNZKcLKbCUj8xqqEOKxDQzKpRfnYGcwARTqPLBwBbxycPCcigqlWxc/vLbjJgVO5
// 5W0htEowaXh8HR0/pmHqYas+x51XRKGEH0imPQgR2yiFXHXHLaQO5DKh26B0ziBj
// wrWVG8aFYtEaK8fIo1sfVy+DgViGKz8hSrVNAp4w73VsTCiV5tXRIMRs9IRgEMhf
// /T8Dcg2rhN5erVnjAcA7Wxzj7/KBh1OD8D19EqbiHjJ1k3btmw==
// -----END CERTIFICATE-----

const key = 'test'

// var options = {
//     key: fs.readFileSync( './edi-p.key' ),
//     cert: fs.readFileSync( './edi-p.crt' ),
//     requestCert: false,
//     rejectUnauthorized: false
// }
// var server = https.createServer(options, app)

// server.listen(process.env.PORT || 5000, function() {
//     console.log('Listening...')
//     console.log(tripleDES.encrypt(key, 'payload'))

//     // fs.writeFileSync('result.txt', Buffer.from(publicKey).toString('utf-8'))
// })

app.get('/', function(req, res) {

})

app.post('/' + 'upload', upload.single('file'), function(req, res) {
    res.status(200).send(
        parseTextToJSON(req.file.buffer.toString())
    )
})

app.listen(process.env.PORT || 5000, function() {
    console.log('Listening...')
    console.log(tripleDES.encrypt(key, 'payload'))

    // fs.writeFileSync('result.txt', Buffer.from(publicKey).toString('utf-8'))
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
            "body": {},
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
                parsed['body'][typeOf] = {}
            }
            if (!parsed['body'][typeOf][seg_id]) {
                parsed['body'][typeOf][seg_id] = []
            }
            parsed['body'][typeOf][seg_id].push(seg)
        }
        else if (seg_id == 'G62') {
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
                    "body": {},
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
                        if (!parsed['body'][seg_id]) {
                            parsed['body'][seg_id] = []
                        }
                        parsed['body'][seg_id].push(seg);
                }
            }
        }
    });

    // console.log(parsedData)
    // fs.writeFileSync('result.txt', Buffer.from(JSON.stringify(parsedData, null, 2)));
    // console.log('FILE UPDATED')

    return parsedData;
}