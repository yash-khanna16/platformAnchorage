
const listings = require('../models/listings')
module.exports.getListings = (req,res,next)=>{
    listings.find({})
        .then((listings)=>{
            res.render('listings',{
                listings
            }); 
        })
        .catch(err=>{
            res.send("no listings found");
        })
}

module.exports.getAdmin = (req,res,next)=>{
    listings.find({})
        .then((listings)=>{
            console.log(listings);
            res.render('admin',{
                listings
            });
        })
        .catch(err=>{
            res.send("no listings found");
        })
}

module.exports.addListing =  (req,res,next)=>{
    const {title, description,ownerName,ownerPhone,pictureURL} = req.body;
    let newListing = new listings({title, description,ownerName,ownerPhone,pictureURL});

    newListing.save()
        .then(()=>{
            console.log("listing added successfully");
            res.redirect('/pgForBoys/admin');
        })
        .catch(err=>{
            res.send(err);
        })
}
module.exports.deleteListing = (req,res,next)=>{
    const {id}=req.body;
    console.log(id);
    listings.deleteOne({_id:id})
        .then(()=>{
            res.render('listings')
        })
        .catch(err=>{
            console.log("could not delete")
        })
}