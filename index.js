const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const axios = require("axios");
const shelljs = require("shelljs");

const config = require("./config.json");
const { Client, LocalAuth } = require("whatsapp-web.js");
const multer = require('multer')
// import { PythonShell } from 'python-shell';


process.title = "whatsapp_api";
global.client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
});

global.authed = false;


const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT;

client.on("qr", (qr) => {
    console.log("qr");
    fs.writeFileSync("./components/last.qr", qr);
});


client.on("authenticated", () => {
    console.log("AUTH!");
    authed = true;

    try {
        fs.unlinkSync("./components/last.qr");
    } catch (err) { }
});

client.on("auth_failure", () => {
    console.log("AUTH Failed !");
    process.exit();
});

client.on("ready", () => {
    console.log("Client is ready!");
});

client.on("message", async (msg) => {
    console.log(msg);
    if (config.webhook.enabled) {
        if (msg.hasMedia) {
            const attachmentData = await msg.downloadMedia();
            msg.attachmentData = attachmentData;
        }
        axios.post(config.webhook.path, { msg });
    }
});
client.on("disconnected", () => {
    console.log("disconnected");
});
client.initialize();

const chatRoute = require("./components/chatting");
const groupRoute = require("./components/group");
const authRoute = require("./components/auth");
const contactRoute = require("./components/contact");
const pythonRoute = require("./components/python.js");
const uploadInvitationRoute = require("./components/upload/invitation_upload.js")
const uploadExcelRoute = require("./components/upload/excel_upload")
const imageManipulationRoute = require("./components/image_manipulation/image");
const res = require("express/lib/response");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "invitation/original_pdf/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

app.use(express.static(__dirname + '/public'));

const uploadPdf = multer({ storage: fileStorage })

const excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "invitation/excel_sheet/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const uploadExcel = multer({ storage: excelStorage })

app.use(function (req, res, next) {
    console.log(req.method + " : " + req.path);
    next();
});

app.use("/chat", chatRoute);
app.use("/group", groupRoute);
app.use("/auth", authRoute);
app.use("/contact", contactRoute);
app.use("/uploadPDF", uploadPdf.single('pdf'), uploadInvitationRoute)
app.use("/uploadFile", uploadExcel.single('excel'), uploadExcelRoute)
app.use("/pythonFontConverter", pythonRoute);
app.use("/image", imageManipulationRoute);

app.get("/imgTemp", (req, res) => {
    var page = `
    <html>
        <body>
            
            <div id="qrcode"></div>
            <img src="D:/Node.js/Whatsapp_Invitation/invitation/test/test.jpg" alt="test image" width="500" height="600">
        </body>
    </html>
`;
    res.sendFile(__dirname + '/public/test_image.html');
    // res.sendFile('D:/Node.js/Whatsapp_Invitation/components/image_manipulation/test_image.html');

})

app.use('/', (req, res) => {
    res.send("Hello")
})

var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(port, server_host, () => {
    console.log("Node executing..");
})

