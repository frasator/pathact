// Include the cluster module
var cluster = require('cluster');

if (cluster.isMaster) {
    // Code to run if we're in the master process

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker %d died :(', worker.id);
        cluster.fork();

    });

} else {
    //  Code to run if we're in a worker process
    /******************************/
    /****** Server instance *******/
    /******************************/

    // Includes
    var exec = require('child_process').exec;
    var fs = require('fs');
    var multer = require('multer');
    var cors = require('cors');
    var mktemp = require('mktemp');
    var express = require('express');

    // Create a new Express application
    var app = express();
    app.use(cors());
    var BASE_PATH = "/mnt/httpd/bioinfo/opencga-0.7/tools/pathways";

    /** Configure the multer. **/

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, req._job_output_folder)
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });

    var upload = multer({
        storage: storage
    })

    var submitFields = [{
        name: 'ko_file',
        maxCount: 1
    }, {
        name: 'working_folder',
        maxCount: 1
    }, {
        name: 'fold_change',
        maxCount: 1
    }];

    // Add a basic route – index page
    app.get('/pathact', function (request, response) {
        console.log('Request to worker %d', cluster.worker.id);
        response.send('It works!');
    });

    app.post('/pathact/update', createFolder, upload.fields(submitFields), function (req, res, next) {
        console.log(req._job_output_folder);
        var args = [];
        args.push('--ko_file ' + req.files.ko_file[0].path);
        args.push('--working_folder ' + req.body.working_folder);
        args.push('--fold_change ' + req.body.fold_change);
        console.log(args);
        var command = 'Rscript ' + BASE_PATH + '/prettyways/ko_cli_update.r ' + args.join(' ');

        console.log('+++++++')
        console.log(command)
        console.log('+++++++')

        exec(command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);

            res.setHeader('Content-Type', 'application/json');
            var response = {
                stdout: stdout,
                stderr: stderr
            };
            res.send(response);

            if (error !== null) {
                var msg = 'exec error: ' + error;
                console.log(msg);
                res.send({
                    error: msg
                })
            }
        });
    });

    app.get('/pathact/clear', function (req, res, next) {
        var folder = req.query.working_folder;
        var commands = [
            'cp ' + folder + 'sifs4CellMaps_init/* ' + folder + 'sifs4CellMaps/',
            'cp ' + folder + 'sifs4CellMaps_init/path_info.json ' + folder,
            'cp ' + folder + 'sifs4CellMaps_init/report.xml ' + folder,
            'cp /dev/null ' + folder + 'ko.txt'
        ];
        var command = commands.join(' && ');

        console.log('+++++++')
        console.log(command)
        console.log('+++++++')

        exec(command, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);

            res.setHeader('Content-Type', 'application/json');
            var response = {
                stdout: stdout,
                stderr: stderr
            };
            res.send(response);

            if (error !== null) {
                var msg = 'exec error: ' + error;
                console.log(msg);
                res.send({
                    error: msg
                })
            }
        });
    });

    function createFolder(req, res, next) {
        var folder = mktemp.createDirSync('/mnt/httpd/bioinfo/pathact-ws/update.temp/update.XXXXXXXXXXXXXXXX');
        fs.chmodSync(folder, '755');
        console.log(folder)
        req._job_output_folder = folder;
        req._job_id = folder.split('/').pop();
        next();
    }

    // Bind to a port
    app.listen(3000);
    console.log('Worker %d running!', cluster.worker.id);

}
