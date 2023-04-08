const router = require("express").Router();
const fs = require("fs");
const { PythonShell } = require('python-shell');



router.post("/excel", (req, res) => {
    console.log(req.file)
    // res.send("excel file upload")
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './components/python/', //If you are having python_test.py script in same folder, then it's optional.
        // args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
    };
    fs.readFile("./invitation/meta_data.json", function (err, data) {
        if (err) {
            console.log("an error occuredd");
            return console.log(err);
        }
        var jsonObj = JSON.parse(data);
        jsonObj.excelname = req.file.originalname;
        // jsonObj.push('noofimg:' + result[0]);
        fs.writeFile("./invitation/meta_data.json", JSON.stringify(jsonObj), async function (err) {
            if (err) {
                console.log("an error occuredd");
                return console.log(err);

            }

        });
    });
    PythonShell.run('excel_font_converter.py', options, function (err, result) {
        console.log("pythonshell");
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());
        res.send('Excel uploaded')
    })
})

module.exports = router;
