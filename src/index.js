const express = require("express"); 
const bodyParser = require("body-parser");
const {default:axios} = require("axios");
const port = process.env.PORT || 5000; //configure express server 
const app = express(); //Body Parser middleware 

const redis = require('redis');
const port_redis = process.env.PORT || 6379; 
const redis_client = redis.createClient(port_redis);

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.set('views', __dirname + '/views'); 
app.get('/', async(req, res) => { res.render('index.ejs') }) 

app.get("/provinsi",async (req,res)=>{ 
    try { 
        const {id}=req.params; 
        const url=`https://api.rajaongkir.com/starter/province`; 
        console.log(url); 
        const dataProvinsi= await axios.get(url, { 
            headers:{ key:"e5b5772849b8bef183b812052d4b19a1"
        } }) 
        console.log(dataProvinsi); 
        return res.json(dataProvinsi.data); 
    } catch(err){
        return res.status(500).json(err); 
    } 
})

//Middleware Function to Check Cache 
checkCache = (req, res, next) => { 
    redis_client.get("provinsi", (err, data) => { 
        if (err) { 
            console.log(err); 
            res.status(500).send(err); 
        } 
        // JIka ditemukan data di cache maka ambil dari cache 
        if (data != null) { 
            res.send(data); 
        } else { 
            next(); 
        } 
    }); 
};

app.listen(port, () => console.log(`Server running on Port ${port}`));