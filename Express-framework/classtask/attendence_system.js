const express=require('express');
const app=express();
app.get("/",(req,res)=>{
    return res.send("Home Page");
})

app.get("/attendence", (req,res)=>{
    const username=req.query.name;
    const present = req.query.present;
    if(present === 'yes'){
        return res.send(`${username} IS PRESENT`);
    } else if(present === 'no'){
        return res.send(`${username} IS ABSENT`);
    } else {
        return res.send("Invalid attendance query");
    }
})

app.listen(3000, () => console.log("Server started"));