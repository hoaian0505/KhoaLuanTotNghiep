require('dotenv').config()
const axios = require('axios');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri=process.env.MONGO_URI;
//const uri = 'mongodb://localhost:27017';
const requestLink = require('request-promise');
const normalize = require('normalize-text').normalizeWhitespaces;
var cheerio = require('cheerio');
const {ObjectID}=require('mongodb');
const companyRoute = require('./routes/company');
const fieldRoute = require('./routes/field');
const userRoute = require('./routes/user');
const sessionRoute = require('./routes/session');
const verifyWebhook = require('./routes/verify-webhook');
var Promise = require('bluebird');

const app = express();
const port = process.env.PORT || 5555;
const DIST_DIR = path.join(__dirname, './dist'); // NEW
const HTML_FILE = path.join(DIST_DIR, 'index.html'); // NEW

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
     extended:true,
 }))
 app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: Date.now() + (7 * 86400 * 1000) }
}));

app.use(express.static(DIST_DIR)); // NEW

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, connectTimeoutMS:120000}, (err, client) => {
  if (err) {
    console.error(err)
  }

  db = client.db('mydb');
  company = db.collection('company');
  field = db.collection('field');
  User = db.collection('User');
  Token = db.collection('Token');
  console.log('Connected to database');

  app.listen(port, function () {
    console.log('App listening on port: ' + port);
  });
}); 


app.get('/app/*', (req, res) => {
    res.sendFile(HTML_FILE); // EDIT
    //res.sendFile(path.join(__dirname,'./src/index.html')); // EDIT
});
  // CRAWL DATA ALONHADAT MUA BAN
  app.get('/alonhadat', async function(req,res){
    try {

      var myPromise = () => {
        return new Promise(async (resolve, reject) => {

          var data;
          let page=0;
          //var linkUrl1 = 'https://alonhadat.com.vn/nha-dat/cho-thue.html';
          var linkUrl1 = ['https://alonhadat.com.vn/can-ban-nha.htm','https://alonhadat.com.vn/nha-dat/can-ban/biet-thu-nha-lien-ke.html','https://alonhadat.com.vn/nha-dat/can-ban/can-ho-chung-cu.html','https://alonhadat.com.vn/nha-dat/can-ban/van-phong.html','https://alonhadat.com.vn/nha-dat/can-ban/dat-nen-lien-ke-dat-du-an.html','https://alonhadat.com.vn/nha-dat/can-ban/mat-bang.html','https://alonhadat.com.vn/nha-dat/can-ban/cac-loai-khac.html'];
          var type = 'mua-ban';
          var category = ['nha','biet-thu','can-ho','van-phong','dat-nen','mat-bang','cac-loai-khac'];
          var mysort = { _id: -1 };
          //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
          //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
          await Promise.map(linkUrl1, async function (e3,i3) {
            let options = {
              uri: e3,
              transform: function (body) {
                  return cheerio.load(body,{ decodeEntities: false });
              }
            };          
            //console.log('stopCrawl =',stopCrawl);
            //await requestLink(linkUrl1,async function(error1,response1,body1){
            await requestLink(options)
              .catch(function (err) {
                console.log('ERROR WHEN REQUEST :',err);
              })
              .then(async function ($) {
                let fieldQuery = {};
                //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                  $('div.content-item').map( async function(e,i){
                    try{
                      //console.log('TEST==',$(this).text);                        
                      var _Tempid = new ObjectID().toString();
                      var _Tempid2 = new ObjectID().toString();
                      //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                      $('div.ct_brief').remove();
                      let titleField = $(this).find('div.ct_title').text();
                      let imgField = $(this).find('div.thumbnail').find('img').attr('src');
                      imgField = 'https://alonhadat.com.vn' + imgField;
                      let NoiDungField = $(this).find('div.text').html();
                      let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                      //console.log('LINK URL == ',checkTitle.length);
                      if (checkTitle.length == 0){
                      //console.log('TITLE NEW ',titleField);
                        fieldQuery={
                          _id : _Tempid,
                          title : titleField,
                          img : imgField,
                          NoiDung : NoiDungField,
                          type:  type,
                          category: category[i3],
                          user: 'admin'
                        };
                        //console.log('FIELD QUERY == ',fieldQuery);
                        await field.insertOne(fieldQuery);
                        let linkurl  = 'https://alonhadat.com.vn' + $(this).find('div.ct_title').find('a').attr('href');
                        let data1 = await getThongTinFromURL(linkurl,data);
                        let dataItems = data1;
                        dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                        dataItems.fieldId = _Tempid;
                        await company.insertOne(dataItems);
                      }   
                    } catch (error) {
                      console.error('ERROR:');
                      console.error(error);
                    } 
                  })
              })
          })
          resolve('success');
        })
      }
      
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      res.json(result);     
    }
    catch (e) {

    }
  })

    // CRAWL DATA ALONHADAT CHO THUE
    app.get('/alonhadat1', async function(req,res){
      try {
        var myPromise = () => {
          return new Promise(async (resolve, reject) => {
  
            var data;
            let page=0;
            //var linkUrl1 = 'https://alonhadat.com.vn/nha-dat/cho-thue.html';
            var linkUrl1 = ['https://alonhadat.com.vn/cho-thue-nha.htm','https://alonhadat.com.vn/nha-dat/cho-thue/biet-thu-nha-lien-ke.html','https://alonhadat.com.vn/nha-dat/cho-thue/can-ho-chung-cu.html','https://alonhadat.com.vn/nha-dat/cho-thue/van-phong.html','https://alonhadat.com.vn/nha-dat/cho-thue/dat-nen-lien-ke-dat-du-an.html','https://alonhadat.com.vn/nha-dat/cho-thue/mat-bang.html','https://alonhadat.com.vn/nha-dat/cho-thue/cac-loai-khac.html'];
            var type = 'cho-thue';
            var category = ['nha','biet-thu','can-ho','van-phong','dat-nen','mat-bang','cac-loai-khac'];
            var mysort = { _id: -1 };
            //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
            await Promise.map(linkUrl1, async function (e3,i3) {
              let options = {
                uri: e3,
                transform: function (body) {
                    return cheerio.load(body,{ decodeEntities: false });
                }
              };          
              //console.log('stopCrawl =',stopCrawl);
              //await requestLink(linkUrl1,async function(error1,response1,body1){
              await requestLink(options)
                .catch(function (err) {
                  console.log('ERROR WHEN REQUEST :',err);
                })
                .then(async function ($) {
                  let fieldQuery = {};
                  //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                    $('div.content-item').map( async function(e,i){
                      try{
                        //console.log('TEST==',$(this).text);                        
                        var _Tempid = new ObjectID().toString();
                        var _Tempid2 = new ObjectID().toString();
                        //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                        $('div.ct_brief').remove();
                        let titleField = $(this).find('div.ct_title').text();
                        let imgField = $(this).find('div.thumbnail').find('img').attr('src');
                        imgField = 'https://alonhadat.com.vn' + imgField;
                        let NoiDungField = $(this).find('div.text').html();
                        let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                        //console.log('LINK URL == ',checkTitle.length);
                        if (checkTitle.length == 0){
                        //console.log('TITLE NEW ',titleField);
                          fieldQuery={
                            _id : _Tempid,
                            title : titleField,
                            img : imgField,
                            NoiDung : NoiDungField,
                            type:  type,
                            category: category[i3],
                            user: 'admin'
                          };
                          //console.log('FIELD QUERY == ',fieldQuery);
                          //await field.insertOne(fieldQuery);
                          let linkurl  = 'https://alonhadat.com.vn' + $(this).find('div.ct_title').find('a').attr('href');
                          let data1 = await getThongTinFromURL(linkurl,data);
                          let dataItems = data1;
                          dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                          dataItems.fieldId = _Tempid;
                          //await company.insertOne(dataItems);
                        }   
                      } catch (error) {
                        console.error('ERROR:');
                        console.error(error);
                      } 
                    })
                })
            })
            resolve('success');
          })
        }
        
        //await myPromise
        var result = await myPromise();   
        
        //continue execution
        res.json(result);     
      }
      catch (e) {
  
      }
    })

    // CRAWL DATA MOGI MUA BAN
    app.get('/mogi', async function(req,res){
      try {
        var myPromise = () => {
          return new Promise(async (resolve, reject) => {
  
            var data;
            let page=0;
            //var linkUrl1 = 'https://alonhadat.com.vn/nha-dat/cho-thue.html';
            var linkUrl1 = ['https://mogi.vn/mua-nha','https://mogi.vn/mua-nha-biet-thu-lien-ke','https://mogi.vn/mua-can-ho-chung-cu','https://mogi.vn/mua-dat-nen-du-an','https://mogi.vn/mua-mat-bang-cua-hang-shop'];
            var type = 'mua-ban';
            var category = ['nha','biet-thu','can-ho','dat-nen','mat-bang'];
            var mysort = { _id: -1 };
            //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
            await Promise.map(linkUrl1, async function (e3,i3) {
              let options = {
                uri: e3,
                transform: function (body) {
                    return cheerio.load(body,{ decodeEntities: false });
                }
              };          
              //console.log('stopCrawl =',stopCrawl);
              //await requestLink(linkUrl1,async function(error1,response1,body1){
              await requestLink(options)
                .catch(function (err) {
                  console.log('ERROR WHEN REQUEST :',err);
                })
                .then(async function ($) {
                  let fieldQuery = {};
                  //console.log('LIST DATA == ',$('ul.props li').text());
                  //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                    $('div.property-list ul.props > li').map( async function(e,i){
                      try{
                        //console.log('TEST==',$(this).find('li.land').html());                        
                        var _Tempid = new ObjectID().toString();
                        var _Tempid2 = new ObjectID().toString();
                        //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                        let titleField = $(this).find('h2.prop-title a').text();
                        let imgField = $(this).find('div.prop-img').find('img').attr('data-src');
                        let addressField = $(this).find('div.prop-addr').text();
                        let dtField = $(this).find('li.land').html();
                        let bedField = $(this).find('li.bed').text()+' phòng ngủ';
                        let bathField = $(this).find('li.bath').text();
                        let priceField = $(this).find('div.price').text();
                        let NoiDungField = `<div class="characteristics"><span class="bedroom" title="${bedField}">${bedField}</span></div><div class="square-direct"><div class="ct_dt"><label>Diện tích:</label> ${dtField}</div><div class="clear"></div></div><div class="price-dis"><div class="ct_price"><label>Giá:</label> ${priceField}</div><div class="ct_dis">${addressField}</div><div class="clear"></div></div>`;
                        let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                        //console.log('LINK URL == ',checkTitle.length);
                        if (checkTitle.length == 0){
                        //console.log('TITLE NEW ',titleField);
                          fieldQuery={
                            _id : _Tempid,
                            title : titleField,
                            img : imgField,
                            NoiDung : NoiDungField,
                            type:  type,
                            category: category[i3],
                            user: 'admin'
                          };
                          //console.log('FIELD QUERY == ',fieldQuery);
                          // await field.insertOne(fieldQuery);
                          let linkurl  = $(this).find('h2.prop-title').find('a').attr('href');
                          //console.log('LINK URL == ',linkurl);
                          let data1 = await getThongTinFromAnotherURL(linkurl,data);
                          // let dataItems = data1;
                          // dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                          // dataItems.fieldId = _Tempid;
                          // await company.insertOne(dataItems);
                        }   
                      } catch (error) {
                        console.error('ERROR:');
                        console.error(error);
                      } 
                    })
                })
            })
            resolve('success');
          })
        }
        
        //await myPromise
        var result = await myPromise();   
        
        //continue execution
        res.json(result);     
      }
      catch (e) {
  
      }
    })

    // CRAWL DATA MOGI CHO THUE
    app.get('/mogi1', async function(req,res){
      try {
        var myPromise = () => {
          return new Promise(async (resolve, reject) => {
  
            var data;
            let page=0;
            //var linkUrl1 = 'https://alonhadat.com.vn/nha-dat/cho-thue.html';
            var linkUrl1 = ['https://mogi.vn/thue-nha','https://mogi.vn/thue-nha-biet-thu-lien-ke','https://mogi.vn/thue-can-ho-chung-cu','https://mogi.vn/thue-dat-nen-du-an','https://mogi.vn/thue-mat-bang-cua-hang-shop'];
            var type = 'cho-thue';
            var category = ['nha','biet-thu','can-ho','dat-nen','mat-bang'];
            var mysort = { _id: -1 };
            //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
            await Promise.map(linkUrl1, async function (e3,i3) {
              let options = {
                uri: e3,
                transform: function (body) {
                    return cheerio.load(body,{ decodeEntities: false });
                }
              };          
              //console.log('stopCrawl =',stopCrawl);
              //await requestLink(linkUrl1,async function(error1,response1,body1){
              await requestLink(options)
                .catch(function (err) {
                  console.log('ERROR WHEN REQUEST :',err);
                })
                .then(async function ($) {
                  let fieldQuery = {};
                  //console.log('LIST DATA == ',$('ul.props li').text());
                  //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                    $('div.property-list ul.props > li').map( async function(e,i){
                      try{
                        //console.log('TEST==',$(this).find('li.land').html());                        
                        var _Tempid = new ObjectID().toString();
                        var _Tempid2 = new ObjectID().toString();
                        //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                        let titleField = $(this).find('h2.prop-title a').text();
                        let imgField = $(this).find('div.prop-img').find('img').attr('data-src');
                        let addressField = $(this).find('div.prop-addr').text();
                        let dtField = $(this).find('li.land').html();
                        let bedField = $(this).find('li.bed').text()+' phòng ngủ';
                        let bathField = $(this).find('li.bath').text();
                        let priceField = $(this).find('div.price').text();
                        let NoiDungField = `<div class="characteristics"><span class="bedroom" title="${bedField}">${bedField}</span></div><div class="square-direct"><div class="ct_dt"><label>Diện tích:</label> ${dtField}</div><div class="clear"></div></div><div class="price-dis"><div class="ct_price"><label>Giá:</label> ${priceField}</div><div class="ct_dis">${addressField}</div><div class="clear"></div></div>`;
                        let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                        //console.log('LINK URL == ',checkTitle.length);
                        if (checkTitle.length == 0){
                        //console.log('TITLE NEW ',titleField);
                          fieldQuery={
                            _id : _Tempid,
                            title : titleField,
                            img : imgField,
                            NoiDung : NoiDungField,
                            type:  type,
                            category: category[i3],
                            user: 'admin'
                          };
                          //console.log('FIELD QUERY == ',fieldQuery);
                          await field.insertOne(fieldQuery);
                          let linkurl  = $(this).find('h2.prop-title').find('a').attr('href');
                          //console.log('LINK URL == ',linkurl);
                          let data1 = await getThongTinFromAnotherURL(linkurl,data);
                          let dataItems = data1;
                          dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                          dataItems.fieldId = _Tempid;
                          await company.insertOne(dataItems);
                        }   
                      } catch (error) {
                        console.error('ERROR:');
                        console.error(error);
                      } 
                    })
                })
            })
            resolve('success');
          })
        }
        
        //await myPromise
        var result = await myPromise();   
        
        //continue execution
        res.json(result);     
      }
      catch (e) {
  
      }
    })

    // CRAWL DATA ALONHADAT MUA BAN
    app.get('/autocrawl', async function(req,res){
      try {
  
        var myPromise = () => {
          return new Promise(async (resolve, reject) => {
  
          var data;
          let page=0;
          var linkUrl1 = 'https://alonhadat.com.vn/nha-dat/can-ban.html';
          var mysort = { _id: -1 };
          //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
          //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
          let stopCrawl = 0;
          //await Promise.map(page, async function (e3,i3) {
            while ((stopCrawl < 5)){
              page+=1;
              linkUrl1 = 'https://alonhadat.com.vn/nha-dat/cho-thue/trang--'+page+'.html';
              console.log('LINK URL == ',linkUrl1);
              let options = {
                uri: linkUrl1,
                transform: function (body) {
                    return cheerio.load(body,{ decodeEntities: false });
                }
              };          
              //console.log('stopCrawl =',stopCrawl);
              //await requestLink(linkUrl1,async function(error1,response1,body1){
              await requestLink(options)
                .catch(function (err) {
                  console.log('ERROR WHEN REQUEST :',err);
                })
                .then(async function ($) {
                  let fieldQuery = {};
                  //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                    $('div.content-item').map( async function(e,i){
                        try{
                          if (stopCrawl < 5){
                            //console.log('TEST==',$(this).text);
                            var _Tempid = new ObjectID().toString();
                            var _Tempid2 = new ObjectID().toString();
                            //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                            $('div.ct_brief').remove();
                            let titleField = $(this).find('div.ct_title').text();
                            let imgField = $(this).find('div.thumbnail').find('img').attr('src');
                            imgField = 'https://alonhadat.com.vn' + imgField;
                            let NoiDungField = $(this).find('div.text').html();
                            let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                            //console.log('LINK URL == ',checkTitle.length);
                            if (checkTitle.length == 0){
                              console.log('TITLE NEW ',titleField);
                              fieldQuery={
                                _id : _Tempid,
                                title : titleField,
                                img : imgField,
                                NoiDung : NoiDungField,
                                user: 'admin'
                              };
                              await field.insertOne(fieldQuery);
                              let linkurl  = 'https://alonhadat.com.vn' + $(this).find('div.ct_title').find('a').attr('href');
                              let data1 = await getThongTinFromURL(linkurl,data);
                              let dataItems = data1;
                              dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                              dataItems.fieldId = _Tempid;
                              await company.insertOne(dataItems);
                            }else{
                              stopCrawl += 1;
                              //console.log('TITLE BI TRUNG ',titleField);
                            }
                            console.log('TONG SO LUONG BI TRUNG =',stopCrawl);   
                          }        
                          //console.log('TONG SO LUONG BI TRUNG =',stopCrawl);     
                        } catch (error) {
                          console.error('ERROR:');
                          console.error(error);
                        } 
                    })
                  })
                // if (error1){
                //   console.log('ERROR WHEN REQUEST :',error1);
                // }else {
                //   $ = cheerio.load(body1, { decodeEntities: false });
                //   let fieldQuery = {};
  
                //   //let stopEach = false;
                //   //console.log(':LENGTH == ',$('div.content-item').length);
                //   let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                //   //$('div.content-item').map( async function(e,i){
                //     try{
                //       if (stopCrawl < 5){
                //         //console.log('TEST==',$(this).text);
                //         var _Tempid = new ObjectID().toString();
                //         var _Tempid2 = new ObjectID().toString();
                //         //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                //         $('div.ct_brief').remove();
                //         let titleField = $(this).find('div.ct_title').text();
                //         let imgField = $(this).find('div.thumbnail').find('img').attr('src');
                //         imgField = 'https://alonhadat.com.vn' + imgField;
                //         let NoiDungField = $(this).find('div.text').html();
                //         let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                //         //console.log('LINK URL == ',checkTitle.length);
                //         if (checkTitle.length == 0){
                //           console.log('TITLE NEW ',titleField);
                //           // fieldQuery={
                //           //   _id : _Tempid,
                //           //   title : titleField,
                //           //   img : imgField,
                //           //   NoiDung : NoiDungField,
                //           //   user: 'admin'
                //           // };
                //           // await field.insertOne(fieldQuery);
                //           // let linkurl  = 'https://alonhadat.com.vn' + $(this).find('div.ct_title').find('a').attr('href');
                //           // let data1 = await getThongTinFromURL(linkurl,data);
                //           // let dataItems = data1;
                //           // dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                //           // dataItems.fieldId = _Tempid;
                //           // await company.insertOne(dataItems);
                //         }else{
                //           stopCrawl += 1;
                //           console.log('TITLE BI TRUNG ',titleField);
                //         }
                //         //console.log('DEM THU TU == ',stopCrawl);
                //       }       
                //       if (e+1 == $('div.content-item').length){
                //         endLoop=true;
                //         console.log('SO THU TU : ',e);
                //         console.log('TONG SO LUONG BI TRUNG =',stopCrawl);
                //         lengthLoop=20;
                //       }   
                //       return lengthLoop;     
                //     } catch (error) {
                //       console.error('ERROR:');
                //       console.error(error);
                //     }
  
                    
                //   }))
                //   //resolve('success');
                // }
              //})  
            }
            resolve('success');
          })
        }
        
        //await myPromise
        var result = await myPromise();   
        
        //continue execution
        res.json(result);     
      }
      catch (e) {
  
      }
    })

    
  // CRAWL DATA FROM ANOTHER SITE EXAMPLE
  app.get('/testing9090', async function(req,res){
    try {

      var myPromise = () => {
        return new Promise(async (resolve, reject) => {

        var data;
        let page=0;
        var linkUrl1 = 'https://mogi.vn/thue-nha-dat';
        var mysort = { _id: -1 };
        //let page = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        //let fieldLast = await field.find({user:'admin'}).sort(mysort).limit(1).toArray();
        let stopCrawl = 0;
        //await Promise.map(page, async function (e3,i3) {
          while ((stopCrawl < 5)){
            page+=1;
            //linkUrl1 = 'https://batdongsan.com.vn/nha-dat-cho-thue/p'+page;
            console.log('LINK URL == ',linkUrl1);
            let options = {
              uri: linkUrl1,
              transform: function (body) {
                  return cheerio.load(body,{ decodeEntities: false });
              }
            };          
            //console.log('stopCrawl =',stopCrawl);
            //await requestLink(linkUrl1,async function(error1,response1,body1){
            await requestLink(options)
              .catch(function (err) {
                console.log('ERROR WHEN REQUEST :',err);
              })
              .then(async function ($) {
                console.log('$ == ',$('.page-title').text());
                let fieldQuery = {};
                //let qwe = await Promise.all($('div.content-item').map( async function(e,i){
                  $('div.content-item').map( async function(e,i){
                      try{
                        if (stopCrawl < 5){
                          //console.log('TEST==',$(this).text);
                          var _Tempid = new ObjectID().toString();
                          var _Tempid2 = new ObjectID().toString();
                          //fieldQuery[i]._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                          $('div.ct_brief').remove();
                          let titleField = $(this).find('div.ct_title').text();
                          let imgField = $(this).find('div.thumbnail').find('img').attr('src');
                          imgField = 'https://alonhadat.com.vn' + imgField;
                          let NoiDungField = $(this).find('div.text').html();
                          let checkTitle = await field.find({title:titleField}).sort(mysort).limit(1).toArray();
                          //console.log('LINK URL == ',checkTitle.length);
                          if (checkTitle.length == 0){
                            console.log('TITLE NEW ',titleField);
                            fieldQuery={
                              _id : _Tempid,
                              title : titleField,
                              img : imgField,
                              NoiDung : NoiDungField,
                              user: 'admin'
                            };
                            await field.insertOne(fieldQuery);
                            let linkurl  = 'https://alonhadat.com.vn' + $(this).find('div.ct_title').find('a').attr('href');
                            let data1 = await getThongTinFromURL(linkurl,data);
                            let dataItems = data1;
                            dataItems._id=_Tempid2; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
                            dataItems.fieldId = _Tempid;
                            await company.insertOne(dataItems);
                          }else{
                            stopCrawl += 1;
                            //console.log('TITLE BI TRUNG ',titleField);
                          }
                          console.log('TONG SO LUONG BI TRUNG =',stopCrawl);   
                        }        
                        //console.log('TONG SO LUONG BI TRUNG =',stopCrawl);     
                      } catch (error) {
                        console.error('ERROR:');
                        console.error(error);
                      } 
                  })
                })
            stopCrawl=5;
          }
          resolve('success');
        })
      }
      
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      res.json(result);     
    }
    catch (e) {

    }
  })

  app.route('/confirmation/:token')
    .get(async (req,res) => {
     
        var token = req.params.token;
        // Find a matching token
        Token.findOne({ token: token }, function (err, token) {
            if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token.' });
     
            // If we found a token, find a matching user
            User.findOne({ _id: token._id}, function (err, user) {
                if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
                let data = {isVerified : true};
                // Verify the user
                User.updateOne({_id: token._id},{$set: data}, (error, result) => {
                  error 
                  ? res.status(500).send({ msg: err.message })
                  //: res.status(200).send("The account has been verified. Please log in.");
                  : res.redirect('/');
                });
            });
        });   
    })


  function getThongTinFromURL(obj,data){
    return new Promise((resolve,reject) => {
      requestLink(obj,function(error2,response2,body2){
        if (error2){
          reject(error2);
        }else {
          $ = cheerio.load(body2, { decodeEntities: false });
          
          let NoiDung = ($(body2).find('div.detail').text());
          let Price = ($(body2).find('div.moreinfor .price .value').html());
          let Square = ($(body2).find('div.moreinfor .square .value').html());
          let DiaChi = ($(body2).find('div.address').text());
          NoiDung = (NoiDung == null) ? '' :normalize(NoiDung);
          Price = (Price == null) ? '' :normalize(Price);
          Square = (Square == null) ? '' :normalize(Square); 
          DiaChi = (DiaChi == null) ? '' :normalize(DiaChi);
          data = {
            NoiDung: NoiDung,
            Price: Price,
            Square: Square,
            DiaChi: DiaChi
          }
          resolve(data);

        }                
      })
    });
  }

  function getThongTinFromAnotherURL(obj,data){
    return new Promise((resolve,reject) => {
      requestLink(obj,function(error2,response2,body2){
        if (error2){
          reject(error2);
        }else {
          $ = cheerio.load(body2, { decodeEntities: false });
          
          let NoiDung = ($(body2).find('div.prop-info-content').text());
          let Price = ($(body2).find('ul.prop-info li').eq(0).text());
          let Square = ($(body2).find('ul.prop-info li').eq(2).html());
          let DiaChi = ($(body2).find('div.address').text());
          NoiDung = (NoiDung == null) ? '' :normalize(NoiDung);
          Price = (Price == null) ? '' :normalize(Price);
          Square = (Square == null) ? '' :normalize(Square); 
          DiaChi = (DiaChi == null) ? '' :normalize(DiaChi);
          if (Price.indexOf(":")>-1){
            Price = Price.slice(Price.indexOf(":")+2);
          }
          if (Square.indexOf(":")>-1){
            Square = Square.slice(Square.indexOf(":")+2);
            if (Square.length ==0){
              Square = ($(body2).find('ul.prop-info li').eq(1).html());
              if (Square.indexOf(":")>-1){
                Square = Square.slice(Square.indexOf(":")+2);
              }
            }
          }
          //console.log(' Gia ==',Price);
          //console.log(' VI TRI ==',Square.length);
          data = {
            NoiDung: NoiDung,
            Price: Price,
            Square: Square,
            DiaChi: DiaChi
          }
          //console.log('LINK == ',obj);
          //console.log('DATA == ',data);
          resolve(data);

        }                
      })
    });
  }


  app.get('/verify',async function(req, res){
    let VERIFY_TOKEN = 'pusher-bot';

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
      console.log('LELELE')
    } else {
        res.sendStatus(403);
      }
  });

app.use('',companyRoute);
app.use('',fieldRoute);
app.use('/user',userRoute);
app.use('/',sessionRoute);
app.use('/img', express.static(__dirname + '/img'));
