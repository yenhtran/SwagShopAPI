var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'), 
    db = mongoose.connect('mongodb://localhost/swag-shop');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.listen(3000, function(){
    console.log('Swag Shop API running on port 3000...');
});
