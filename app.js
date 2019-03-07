const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const watson = require('watson-developer-cloud');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(cors());

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

app.use(express.json())

var port = 6001;
var mensajes = [];
var context = '';

var assistant = new watson.AssistantV1({
    version: '2018-09-20',
    iam_apikey: '9X9zE5F32tGW9I0iJbbBAkFjDGyT-scu231KkNEVu4nR',
    url: 'https://gateway.watsonplatform.net/assistant/api'
});


app.get('/', function (req, res) {
    if(mensajes.length == 0) {
        var params = {
            workspace_id: '68e593fa-1bcf-4d3b-8d51-2f239be4ba08',
            input: {
                'text': ''
            }
        }
        assistant.message(params, function (err, result, response) {
            if (err)
                console.log('error:', err);
            else {
                var respuesta;
                context = result.context;
                respuesta = result.output.text[0];
                let mensaje = {
                    mensaje: respuesta,
                    clase: 'bot'
                }
                mensajes.push(mensaje)
                res.render('home', {mensajes});
            }
        })
    } else {
        res.render('home', { mensajes });
    }
   
});

app.post('/mensaje', function (req, res) {
    var texto = req.body.texto;
    let mensaje = {
        mensaje: texto,
        clase: 'user'
    }
    mensajes.push(mensaje);
    var params = {
        workspace_id: '68e593fa-1bcf-4d3b-8d51-2f239be4ba08',
        input: {
            'text': texto
        },
        context: context
    }
    assistant.message(params, function (err, result, response) {
        if (err)
            console.log('error:', err);
        else {
            var respuesta;
            context = result.context;
            respuesta = result.output.text[0];
            let mensaje = {
                mensaje: respuesta,
                clase: 'bot'
            }
            mensajes.push(mensaje)
            res.redirect('/');
        }
    })
});

app.listen(port, () => {
    console.log('Server listening on port: ' + port);
});