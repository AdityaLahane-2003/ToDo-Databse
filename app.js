//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser"); 
const mongoose = require("mongoose"); 
const date = require(__dirname + "/date.js");
const _ = require("lodash"); 
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://admin-aditya:Aditya%402003@cluster0.j32qbwo.mongodb.net/todolistDB");  

const itemsSchema = new mongoose.Schema({
         name: String
}); 

const Item = mongoose.model("Item", itemsSchema); 

const item1 = new Item({
  name:"Buy Food"
});
const item2 = new Item({
  name:"Cook Food"
});
const item3 = new Item({
  name:"Eat Food"
});
 
const defaultItems = []; 
const listSchema = { 
  name:String, 
  items:[itemsSchema] 
}

const List = mongoose.model("List", listSchema); 


app.get("/", function(req, res) {
  Item.find({}, function (err,foundItems) {  

    // if(foundItems.length===0){
    //   Item.insertMany(defaultItems,function (err) {
    //     if(err){
    //      console.log(err);
    //       }else{
    //         console.log("Added"); 
    //       } 
    //   }) 
    //   res.redirect("/");
    // } 
    // else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});  
    // } 
  }) ; 
}); 

app.get("/:customListName", function (req,res) {
  const customListName =  _.capitalize(req.params.customListName); 

  List.findOne({name:customListName},function (err, foundList) {
    if(!err){
      if(!foundList){
        console.log("Doen't Exists");
        //Create New List 
        const list = new List({
          name: customListName, 
          items:[]
         });  
         list.save(); 
         res.redirect("/"+customListName)
        }
        else{
          //Show an Existing List 
          res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
        
      }
    }
  })

  
}); 

app.post("/", function(req, res){

  const itemName = req.body.newItem; 
  const listName = req.body.list; 
    
  const item = new Item({
    name : itemName
  }) 

  if (listName === "Today") {
    item.save(); 
    res.redirect("/"); 
  } else {
    List.findOne({name:listName}, function (err,foundList) {
      foundList.items.push(item); 
      foundList.save(); 
      res.redirect("/"+listName);
    })
  }


  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // } 
}); 

app.post("/delete", function (req,res) {
  const checkedItemId = (req.body.checkbox); 
  const listName = req.body.listName; 
 
  if (listName==="Today") {
    Item.findByIdAndRemove(checkedItemId,function (err) {
      if(!err){
        console.log("Success");
        res.redirect("/");
      }
    }); 
  } else {
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function (err,results) {
      if(!err){
        res.redirect("/"+listName);  
      }
    }); 
  }

})


app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


// Express Route Parameters 
// app.get("/category/:paramName", function(req,res){
//Access req.params.paramName 
// })