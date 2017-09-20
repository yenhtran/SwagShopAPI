var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'), 
    db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product'),
    WishList = require('./model/wishlist');

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product', function(req, res){
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save(function(err, savedProduct){
        if (err) {
            res.status(500).send({error: "Could not save product"});
        } else {
            res.send(savedProduct);
        }
    })

});

app.get('/product', function(req, res){
    Product.find({}, function(err, products){
        if (err) {
            res.status(500).send({error: "Couldn't find products"})
        } else {
            res.send(products);
        }
    })
});

app.get('/wishlist', function(req, res) {
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishList){
        if (err) {
            res.status(500).send({error: "Couldn't fetch wishLists"});
        } else {
            res.status(200).send(wishList);
        }
    })
});

app.post('/wishlist', function(req, res) {
    var wishList = new WishList();
    wishList.title = req.body.title;
    
    wishList.save(function(err, newWishList){
        if (err) {
            res.status(500).send({error: "Could not create wishList"});
        } else {
            res.send(newWishList);
        }
    })
    
});

app.put('/wishlist/product/add', function(req, res){
    Product.findOne({_id: req.body.productId}, function(err, product){
        if(err){
            res.status(500).send({error: "Could not add item to wishlist"});
        } else {
            WishList.update({_id: req.body.wishListId}, {$addToSet: {products: product._id}}, function(err, wishList){
                if (err) {
                    res.status(500).send({error: "Could not update WishList"})
                } else {
                    res.send("Successfully added to wishlist")
                }
            })
        }
    })
})


app.listen(3004, function(){
    console.log('Swag Shop API running on port 3004...');
});
 