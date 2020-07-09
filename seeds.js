const mongoose      =   require('mongoose');
const Campground    =   require('./models/campgrounds');
const Comment       =   require('./models/comments');

let seedCampgrounds = 
[
    {
        name: "Lake Winefred",
        image: "https://pikeyaker.files.wordpress.com/2012/08/img_2210.jpg",
        description: "A beautiful lake located in Northern Alberta, Canada.  Known for it's high quality fishing" 
    },
    {
        name: "Mount Sinai",
        image: "https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/10/931/524/Split-Rock-at-Horeb-Saudi-Arabia-Original.jpg?ve=1&tl=1",
        description: "Moses received the ten commandments here.  Doesn't look like there's alot of shade"            
    },
    {
        name: "Mammoth Lake",
        image: "https://1fpypn35pt1l3uwyne14018c-wpengine.netdna-ssl.com/wp-content/uploads/2017/08/Stoen-Mammoth-Lakes-2017-1-of-27.jpg",
        description: "A few hours north of the sleepy California town of Bishop, you'll be amazed at how prestine nature in California can really be."            
    }
];

// function seedDB(){
// Campground.remove({}, (err, campgrounds) => {
//     if(err){
//         console.log(error);
//     }   else {
//         console.log("all campgrounds removed");
//         Campground.collection.insertMany(seedCampgrounds);
//         Comment.create({author:"moi", body:"this that and the other"}, (err, comment) => {
//             if(err){
//                 next(err);
//             } else {
//                 console.log(comment._id)
//                 Campground.find({}, (err, campground) => {
//                     if(err){
//                         next(err)
//                     } else {
//                         campground.forEach(item => {
//                             item.comments.push(comment);
//                             item.save();
//                         });
//                     }

//                 })
                
//             }
//         } )


//     }
// })
// }

function seedDB(){
    Campground.remove({}, (removeErr, removedCollection) => {
        if(removeErr){
            next(removeErr);
        } else {
            console.log("collection removed");
            for(let doc of seedCampgrounds){
                Campground.create(doc, (createDocErr, docCreated) => {
                    if(createDocErr){
                        next(createDocErr);
                    } else {
                        console.log(docCreated);
                        Comment.create({
                            author: "Moi",
                            text: "You stupid ant-eater, you ruined my entrance!"
                        }, (createComErr, createdComment) =>{
                            if(createComErr){
                                next(createComErr);
                            } else {
                                docCreated.comments.push(createdComment);
                                docCreated.save();
                                console.log("comment pushed successfully");
                            }
                        })
                    }
                })
            }
        }

    })
}

module.exports = seedDB;