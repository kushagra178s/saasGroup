const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const { Snowflake } = require("@theinternetfolks/snowflake");
app.use(bodyParser());
const connection = require("../../mongodb");
const Role = require("../../models/roleModel"); 


router.post("/", async (req, res)=>{
    const {name} = req.body;
    console.log(req.body);
    try{
        const newRole = new Role({
            id: Snowflake.generate(),
            name : req.body.name,
        }); 
        await newRole.save();
        res.status(200).json({role:newRole})
    }
    catch(e) {
        return res.json({error:e.message});
    }
})

router.get("/", async (req, res)=>{
    try{
        const data = await Role.find({});
        const responseData = {
            content:{
                total : data.length,
                pages : 1,
                page : 1
            },
            data
        }
        res.status(200).json({responseData});
    }
    catch(e) {
        return res.json({error:e.message});
    }
})

module.exports = router;