const router = require('express').Router();
const { MessageMedia, Location } = require("whatsapp-web.js");
const request = require('request')
const vuri = require('valid-url');
const fs = require('fs');
const reader = require("xlsx");
const { json } = require('express/lib/response');
const { time } = require('console');

const mediadownloader = (url, path, callback) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback)
    })
}

router.post('/sendmessage/:phone', async (req, res) => {
    let phone = req.params.phone;
    //  let phone = "918866649459"; 
    let message = req.body.message;

    if (phone == undefined || message == undefined) {
        res.send({ status: "error", message: "please enter valid phone and message" })
    } else {
        client.sendMessage(phone + '@c.us', message).then((response) => {
            if (response.id.fromMe) {
                res.send({ status: 'success', message: `Message successfully sent to ${phone}` })
            }
        });
    }
});

router.post('/sendimage/:phone', async (req, res) => {
    var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    let phone = req.params.phone;
    //let phone = "918866649459"; 

    let image = req.body.image;
    let caption = req.body.caption;

    if (phone == undefined || image == undefined) {
        res.send({ status: "error", message: "please enter valid phone and base64/url of image" })
    } else {
        if (base64regex.test(image)) {
            let media = new MessageMedia('image/png', image);
            client.sendMessage(`${phone}@c.us`, media, { caption: caption || '' }).then((response) => {
                if (response.id.fromMe) {
                    res.send({ status: 'success', message: `MediaMessage successfully sent to ${phone}` })
                }
            });
        } else if (vuri.isWebUri(image)) {
            if (!fs.existsSync('./temp')) {
                await fs.mkdirSync('./temp');
            }

            var path = './temp/' + image.split("/").slice(-1)[0]
            mediadownloader(image, path, () => {
                let media = MessageMedia.fromFilePath(path);

                client.sendMessage(`${phone}@c.us`, media, { caption: caption || '' }).then((response) => {
                    if (response.id.fromMe) {
                        res.send({ status: 'success', message: `MediaMessage successfully sent to ${phone}` })
                        fs.unlinkSync(path)
                    }
                });
            })
        } else {
            res.send({ status: 'error', message: 'Invalid URL/Base64 Encoded Media' })
        }
    }
});

router.post('/sendpdf/:phone', async (req, res) => {
    var jsonObj;
    var interval = [4, 5, 6, 7, 8]
    await fs.readFile("./invitation/meta_data.json", async function (err, metadata) {
        if (err) {
            console.log("an error occuredd");
            return console.log(err);
        }
        jsonObj = JSON.parse(metadata);
        console.log(jsonObj);
        const file = reader.readFile(`./invitation/excel_sheet/${jsonObj.excelname}`);

        let data = [];

        const sheets = file.SheetNames;

        for (let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
            temp.forEach((res) => {
                data.push(res);
            });
        }

        let i = 0;
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var randomInteger = interval[Math.floor(Math.random() * interval.length)];

            let phoneno = data[i].mobileno;
            let media = MessageMedia.fromFilePath(`./invitation/pdfs/${phoneno}.pdf`);
            client.sendMessage(`91${phoneno}@c.us`, media).then((response) => {

            });

            console.log(randomInteger.toString())
            await new Promise(resolve => setTimeout(resolve, randomInteger * 1000));
        }

        res.send({
            status: "success",
            message: "MediaMessage successfully sent",
        });
    })


    // console.log
});

router.post('/sendlocation/:phone', async (req, res) => {
    let phone = req.params.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    let desc = req.body.description;





    if (phone == undefined || latitude == undefined || longitude == undefined) {
        res.send({ status: "error", message: "please enter valid phone, latitude and longitude" })
    } else {
        let loc = new Location(latitude, longitude, desc || "");
        client.sendMessage(`${phone} @c.us`, loc).then((response) => {
            if (response.id.fromMe) {
                res.send({ status: 'success', message: `MediaMessage successfully sent to ${phone} ` })
            }
        });
    }
});

router.get('/getchatbyid/:phone', async (req, res) => {
    let phone = req.params.phone;
    if (phone == undefined) {
        res.send({ status: "error", message: "please enter valid phone number" });
    } else {
        client.getChatById(`${phone} @c.us`).then((chat) => {
            res.send({ status: "success", message: chat });
        }).catch(() => {
            console.error("getchaterror")
            res.send({ status: "error", message: "getchaterror" })
        })
    }
});

router.get('/getchats', async (req, res) => {
    client.getChats().then((chats) => {
        res.send({ status: "success", message: chats });
    }).catch(() => {
        res.send({ status: "error", message: "getchatserror" })
    })
});

module.exports = router;