const path = require("path");
const express = require("express");
const app = express();
const Vimeo = require('vimeo').Vimeo;
const formidable = require('formidable');

const publicPath = path.join(__dirname, "..", "public");
const port = process.env.PORT || 8080;
const client_id = "d23cb5cb2df23af31fa59afba406dc11b8c778c5";
const client_secret = "rbIORbkcr1f9WrlkTbIBdCtI/TAK5IkIV/byoZfx4ZEQwvlmUhxhPVIWKXFLdyMa28cssBiyN3odC2bLQTKllRhN8v/b1FD4Iuyfe1fPdhdAxEaFXVTkk887EukLWCma";
const access_token = "dd03cccb360992f158f5c3043c18c534";
let client = new Vimeo(client_id, client_secret, access_token);

app.use(express.static(publicPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.post("/upload", (req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {

    client.upload(
      files.file.path,
      {
        "name": fields.name,
        "description": fields.description
      },
      function (uri) {
        console.log('Your video URI is: ' + uri);
        res.status(200).send(uri)
      },
      function (bytes_uploaded, bytes_total) {
        var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
        console.log(bytes_uploaded, bytes_total, percentage + '%')
      },
      function (error) {
        console.log('Failed because: ' + error)
      }
    )
  })
});

app.post("/checkVimeo", (req, res) => {
  client.request({
    method: "GET",
    path: "/users/91401744/videos"
}, function(error, body, status_code, headers) {
  if (error) {
    console.log('error');
    console.log(error);
  } else {
    res.status(200).send(body.data)
  }
})

});

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});