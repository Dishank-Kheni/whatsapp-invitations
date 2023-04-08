
const router = require("express").Router();
const fs = require("fs");
const { PythonShell } = require('python-shell');
const { dirname } = require('path');


router.get("/testImage", (req, res) => {
    // console.log(req.params);
    console.log(req.query);
    console.log(req.body);
    let coordinate = [];
    coordinate.push(parseFloat(req.query.coordinateL));
    coordinate.push(parseFloat(req.query.coordinateR));

    let color = [];
    color.push(parseFloat(req.query.r));
    color.push(parseFloat(req.query.g));
    color.push(parseFloat(req.query.b));

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './components/python/', //If you are having python_test.py script in same folder, then it's optional.
        // args: [req.body.imageno, req.body.text, req.body.coordinate, req.body.color, req.body.size]//An argument which can be accessed in the script using sys.argv[1]
        args: [req.query.imageno, req.query.text, coordinate, color, req.query.size]//An argument which can be accessed in the script using sys.argv[1]
    };

    PythonShell.run('image_test.py', options, function (err, result) {
        console.log("pythonshell");
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        // console.log('result: ', result.toString());

        const appDir = dirname(require.main.filename);
        res.sendFile(appDir + '/public/test_image.html');
    })
    // console.log("test image");
    // res.send("Images");
}),


    router.get("/finalImages", (req, res) => {
        // console.log(req.query);
        // var data = JSON.parse(req.body)
        // con(data);
        let options = {

            mode: 'json',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: './components/python/', //If you are having python_test.py script in same folder, then it's optional.
            args: JSON.stringify(req.body)
            // args:   [req.body.imageno, req.body.text, req.body.coordinate, req.body.color, req.body.size]//An argument which can be accessed in the script using sys.argv[1]
        };


        // let pyshell = new PythonShell('pdf_generator.py');
        PythonShell.run('pdf_generator.py', options, function (err, result) {
            if (err) { console.log("Error generate"); }
            console.log(err, result);
            res.send("pdf converter")
        });

        // pyshell.send(JSON.stringify({ 'home': 1 }));

        // pyshell.on('message', function (message) {
        //     // received a message sent from the Python script (a simple "print" statement)
        //     console.log(message);
        // });

        // end the input stream and allow the process to exit
        // pyshell.end(function (err) {
        //     if (err) {
        //         throw err;
        //     };

        //     console.log('finished');
        //     res.send("finished");
        // });

        // PythonShell.send(req.body, { mode: 'json' })
        // PythonShell.on('message', function (message) {
        //     // received a message sent from the Python script (a simple "print" statement)
        //     console.log(message);
        // });

    })


module.exports = router;
