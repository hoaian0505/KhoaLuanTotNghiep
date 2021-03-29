const express = require('express');
const field_router = express.Router();
const {ObjectID}=require('mongodb');
const requestLink = require('request');
var cheerio = require('cheerio');
const normalize = require('normalize-text').normalizeWhitespaces;

  //save data to field database
  field_router.post('/field',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var data = request.body;
          var _Tempid = new ObjectID().toString();
          data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
          field.insertOne(data, (error, result) => {
            error 
            ? reject(error) 
            : resolve({success:true,id:_Tempid});
          });
          // console.log('DATA == ',data);
          // resolve({sudccess:true});
        });
      };
      var result = await myPromise();   
        
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get field database
  field_router.get('/field/', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          field.find({}).toArray((error, result) => {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result);
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get last TotalPage in field database
  field_router.get('/field/pagelast',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var mysort = { _id: -1 };
          field.find().sort(mysort).limit(1).toArray(function(error, result)  {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result[0].TotalPages);   
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get last field in field database
  field_router.get('/field/fieldlast',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var mysort = { _id: -1 };
          field.find().sort(mysort).limit(1).toArray(function(error, result)  {
              // if(error) {
              //     return response.status(500).send(error);
              // }
              // response.send(result[0].Field); 
              error 
              ? reject(error) 
              : resolve({success:true,result:result});
          });
        });
      };
      //await myPromise
      var result1 = await myPromise();   
      
      //continue execution
      response.json(result1);
  
    } catch (e) {
      next(e)
    }
  });

  //get all field in field database
  field_router.get('/field/allfields',async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          field.find({}).sort({ _id: -1 }).toArray((error, result) => {
            if (error){
              reject(error);
            }else {
              resolve({success:true,result:result,length:result.length});
            }
          });
        });
      };
      //await myPromise
      var result1 = await myPromise();   
      
      //continue execution
      response.json(result1);
  
    } catch (e) {
      next(e)
    }
  });

  //delete field in field Database with id
  field_router.delete('/field/id/:id', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getid = request.params.id;
          field.deleteOne({_id: getid}, (error, result) => {
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log('da xoa 1 database');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get field by id in field Database
  field_router.get('/field/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          let id = request.params.field;
          field.find({_id:id}).toArray((error, result) => {
              error 
              ? reject(error) 
              : resolve({success:true,result:result});
              ;
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
    } catch (e) {
      next(e)
    }
  });

  //delete field in field Database
  field_router.delete('/field/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getField = request.params.field;
          field.deleteOne({Field: getField}, (error, result) => {
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      console.log('da xoa 1 database theo Linh Vuc');
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //update field in field Database
  field_router.put('/field/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          let _id = request.params.field;
          var data = request.body;
          console.log('DATA == ',data);
          field.updateOne({_id:_id},{$set: data}, (error, result) => {
              error 
              ? reject(error) 
              : resolve({success:true,id:_id,result:result});
          });

          // var data = request.body;
          // var _Tempid = new ObjectID().toString();
          // data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
          // field.insertOne(data, (error, result) => {
          //   error 
          //   ? reject(error) 
          //   : resolve({success:true,id:_Tempid});
          // });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //get TotalPages of field Database by field
  field_router.get('/field/page/:field', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getField = request.params.field;
          field.find({Field:getField}).toArray((error, result) => {
              error 
              ? reject(error) 
              : resolve(result);
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
      
      //continue execution
      response.json(result);
  
    } catch (e) {
      next(e)
    }
  });

  //return true-false when checked 
  field_router.get('/field/link/:link', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getTempLink = request.params.link;
          var getLink = getTempLink.replace(/`/gi, '/');
          field.find({link:getLink}).toArray((error, result) => {
              if (error){
                reject(error);
              }else {
                if (result.length == 0)
                {
                  resolve(false);
                }
                else{
                  resolve(true);
                }
              }
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
        
      //continue execution
      response.json(result);
    
    } catch (e) {
      next(e)
    }
  });

  //get TotalPages of field Database by field
  field_router.get('/fieldsort', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          let type=request.query.type;
          let sortby = '$'+type;
          field.aggregate([
            { 
              $project: {
              _id: 1,
              title: 1,
              img: 1,
              NoiDung: 1,
              user: 1,
              like: 1,
              comments: 1,
              length: { $cond: { if: { $isArray: sortby }, then: { $size: sortby }, else: 0} }
              }
            }
          ]).sort({length:-1}).toArray((error, result) => {
              error 
              ? reject(error) 
              : resolve(resolve({success:true,result:result,length:result.length}));
          });
        });
      };
      //await myPromise
      var result1 = await myPromise();   
      
      //continue execution
      response.json(result1);
  
    } catch (e) {
      next(e)
    }
  });

  //search in field
  field_router.post('/field/search', async (request, response,next) => {
    try {
      var myPromise = () => {
        return new Promise((resolve, reject) => {
          var getData = request.body.data;
          let type = request.body.type;
          let category = request.body.category;
          let dataSearch;
          if (getData.indexOf(":") >= 0){
            getData = getData.replace(":",":</label>");
            //console.log('GET DATA ei == ',getData);
          }
          var Data = `\"`+getData+`\"`;
          //console.log('NOI DUNG == ',Data);
          //var getLink = getTempLink.replace(/`/gi, '/');
          dataSearch = {$text:{$search:Data}, type:type, category:category};
          if ((type == '') && (category == 'tat-ca')){
            dataSearch = {$text:{$search:Data}};
          }
          else if (type == ''){
            dataSearch = {$text:{$search:Data},category : category};
          }
          else if (category == 'tat-ca'){
            dataSearch = {$text:{$search:Data},type : type};  
          }
          console.log('POST DATA == ',request.body)
          console.log('DATA SEARCH ==',dataSearch)
          field.createIndex({NoiDung:"text"});
          field.find(dataSearch).toArray((error, result) => {
              if (error){
                reject(error);
              }else {
                if (result.length == 0)
                {
                  resolve(false);
                }
                else{
                  resolve({success:true,result:result,length:result.length});
                }
              }
          });
        });
      };
      //await myPromise
      var result = await myPromise();   
        
      //continue execution
      response.json(result);
    
    } catch (e) {
      next(e)
    }
  });

// Exports cho biến field_router
module.exports = field_router;