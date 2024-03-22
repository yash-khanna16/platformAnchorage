
const guests = require('../models/guests')
module.exports.getGuests = (req,res,next)=>{
    guests.find({})
        .then((guests)=>{
            res.render('guests',{
                guests
            }); 
        })
        .catch(err=>{
            res.send("no guests found");
        })
}

module.exports.getAdmin = (req,res,next)=>{
    if(req.user){
        guests.find({})
            .then((guests)=>{
                // console.log(guests);
                res.render('admin',{
                    guests
                });
            })
            .catch(err=>{
                res.send("no guests found");
            })
    }
    else{
        res.render("login");
    }
}

module.exports.addGuestDetails = async (req, res, next) => {
    const { pname, email, rank, phoneNumber, companyName } = req.body;
    let newGuest = new guests({ pname, email, rank, phoneNumber, companyName });
    
    try {
        const existingGuest = await guests.findOne({ phoneNumber: phoneNumber });
        if (existingGuest) {
            console.log("existing guest");
        } else {
            await newGuest.save();
            console.log("guest details added successfully");
            res.redirect('/platformAnchorage/admin');
        }
    } catch (err) {
        console.log("Error:", err);
        res.send(err);
    }
}
module.exports.deleteGuestDetails = (req,res,next)=>{
    const {id}=req.body;
    console.log(id);
    guests.deleteOne({_id:id})
        .then(()=>{
            res.render('guests')
        })
        .catch(err=>{
            console.log("could not delete")
        })
}