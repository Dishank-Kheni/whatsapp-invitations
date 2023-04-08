const router = require("express").Router();
// import { PythonShell } from 'python-shell';
const { PythonShell } = require('python-shell');

router.get("/fontconvert", async (req, res) => {
    console.log("req coming")

    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: './', //If you are having python_test.py script in same folder, then it's optional.
        // args: ['shubhamk314'] //An argument which can be accessed in the script using sys.argv[1]
    };

    PythonShell.run('test.py', options, function (err, result) {
        if (err) throw err;
        // result is an array consisting of messages collected
        //during execution of script.
        console.log('result: ', result.toString());
        res.send(result.toString())
    });
    // const { spawn } = require('child_process');

    // const python = spawn('python', ['test.py']);
    // python.stdout.on('data', function (data) {
    //     console.log('Pipe data from python script ...');
    //     dataToSend = data.toString();
    //     res.write(dataToSend)
    // });
});

module.exports = router;