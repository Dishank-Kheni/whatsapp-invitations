const router = require("express").Router();
const fs = require("fs");
const { url } = require("inspector");
const { PythonShell } = require('python-shell');
const cloudinary = require('cloudinary').v2
// const fs = require('fs')

cloudinary.config({
    cloud_name: 'dm1gtxtpf',
    api_key: '977925352738894',
    api_secret: 'NaMe0jg60bGcNbKlzg66iHfyZP8'
});


router.post("/invitation", async (req, res) => {
    console.log(req.file.originalname)
    // res.send("pdf_uploaded")
    var imgename = req.file.originalname.replace(".pdf", "");
    var json_data = { 'pdfname': req.file.originalname, 'imgbasename': imgename }
    var jsonContent = JSON.stringify(json_data);
    fs.writeFile("./invitation/meta_data.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("an error occuredd");
            return console.log(err);
        }
    })
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './components/python/', //If you are having python_test.py script in same folder, then it's optional.
        // args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
    };
    PythonShell.run('pdf_to_jpg.py', options, function (err, result) {
        console.log("pythonshell");
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());

        fs.readFile("./invitation/meta_data.json", function (err, data) {
            if (err) {
                console.log("an error occuredd");
                return console.log(err);
            }
            var jsonObj = JSON.parse(data);
            jsonObj.noofimage = result[0];
            // jsonObj.push('noofimg:' + result[0]);
            fs.writeFile("./invitation/meta_data.json", JSON.stringify(jsonObj), async function (err) {
                if (err) {
                    console.log("an error occuredd");
                    return console.log(err);

                }
                console.log("obj");
                console.log(jsonObj);
                var urls = {};
                var maxImg = result[0];
                for (var i = 0; i < result[0]; i++) {
                    var iname = jsonObj.imgbasename;
                    await cloudinary.uploader.upload("./invitation/original_images/" + iname + i + ".jpg", (error, result) => {
                        console.log(result, error);
                        urls[`image${i}`] = result.url;
                        if (i == (maxImg - 1)) {
                            console.log("write to file");
                            fs.writeFile("./invitation/img_urls.json", JSON.stringify(urls), function (err) {
                                if (err) {
                                    console.log("an error occuredd");
                                    return console.log(err);
                                }
                            })
                            res.send(urls);
                        }

                    });
                }
            })
        })
    });

})


module.exports = router;
