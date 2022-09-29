var express = require('express');
var router = express.Router();
var pg = require('pg');

var pg_setting={
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  //一応Poolオブジェクトは生成されている
  var pool = new pg.Pool(pg_setting);
  //データベースに接続
  pool.connect(function(err,client){
    if(err){
      console.log(err);
    }else{
      client.query('SELECT * from board_db',function(err,results){
        var data = {
          title:'Black Board',
          //rowsにデータベースから引っ張ってきたデータが入っている
          content:results.rows
        };
        res.render('index',data);
        //resultsの値がない undefined
      });
    }
  });
  pool.end();
});

router.post('/',function(req,res,next){
  //postは機能している
  var data={
    'name':req.body.name,
    'text':req.body.text
  };
  //↑は値を確保できている
  var pool = new pg.Pool(pg_setting);

  pool.connect(function(err,client){
    if(err){
      console.log(err);
    }else{
      client.query({text:'insert into board_db (name, text) values ($1,$2)',values:[data.name,data.text]},function(err,results){
        res.redirect('/');
      });
    }
  });
  pool.end();
});

router.post('/delete',function(req,res,next){
  var id = req.body.id;

  var pool = new pg.Pool(pg_setting);

  pool.connect(function(err,client){
    if(err){
      console.log(err);
    }else{
      client.query({text:'delete from board_db where id = $1',values:[id]},function(err,results){
        res.redirect('/');
      });
    }
  });
  pool.end();
});


module.exports = router;
