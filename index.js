const express = require('express')
const db = require('./connect.js')

const app = express()
require('dotenv').config();
const PORT = process.env.PORT

app.use(express.json())

app.use((req,res,next) => {
    res.set('Access-Control-Allow-Origin','*')
    next()
})


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.post('/add', (req,res) => {


    const data = [req.body.name, req.body.author,req.body.cur_price,req.body.prev_price,req.body.sales_per,req.body.description,req.body.cover,req.body.tags,req.body.category,req.body.publisher,req.body.release_year,req.body.isbn,req.body.pages,req.body.size,req.body.cover_type,req.body.weight,req.body.age_restrictions,req.body.presented];

    // for(let i = 0; i<data.length;i++) {data[i] == null ? data[i] = 'blank' : data[i] = data[i]}
    res.json(data)

    const sql = "INSERT INTO `books` (`id`, `name`, `author`, `cur_price`, `prev_price`, `description`, `cover`, `tags`, `category`, `publisher`, `release_year`, `isbn`, `pages`, `size`, `cover_type`, `weight`, `age_restrictions`, `presented`) VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    
    db.connection.query(sql, data, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
        // res.send("Данные добавлены")
    });
    
    

})

app.get('/getMainData', (req,res) => {
    // let limit = 10
    // if(req.params['limit'] > 0) {limit = req.params['limit']}
    // console.log(limit)

    let preparedData = {sales: null, newBooks: null,topSelling: null}

    db.connection.execute("SELECT * FROM `books` WHERE `tags` LIKE '%скидки%'", (err, results) => {
        preparedData.sales = results
        if(err) console.log(err)
        else console.log("Данные отданы");

    })

    db.connection.execute("SELECT * FROM `books` WHERE `tags` LIKE '%топ продаж%'", (err, results) => {
        preparedData.topSelling = results
        if(err) console.log(err)
        else console.log("Данные отданы");

    })


    db.connection.execute("SELECT * FROM `books` ORDER BY `id` DESC LIMIT 10", (err, results) => {
        preparedData.newBooks = results
        if(err) console.log(err)
        else console.log("Данные отданы");
        res.send(preparedData)
    })

    


})


app.get('/getBook/:id',(req,res) => {
    const book_id = [req.params['id']]
    db.connection.execute("SELECT * FROM `books` WHERE `id` = ?", book_id,(err, results) => {
        if(err) console.log(err)
        else console.log("Данные отданы");
        res.send(results[0])
    })
})


app.post('/getBooksForCart/',(req,res) => {
    
   

    const book_ids = req.body.IDs
    console.log(book_ids)
    // res.send('allahu akbar !')
    db.connection.execute("SELECT * FROM `books` WHERE `id` IN (" + book_ids.join() + ")", book_ids,(err, results) => {
        if(err) console.log(err)
        else console.log("Данные отданы");
        res.send(results)
    })
})






















app.listen(PORT, () => console.log(`Server has started on port ${PORT}`))





