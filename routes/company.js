const express = require('express');
const company_router = express.Router();
const {ObjectID}=require('mongodb');

//get data in company database
company_router.get('/company',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
      company.find({}).toArray((error, result) => {
            error 
            ? reject(err) 
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

//update field in company database
company_router.put('/company/:field',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field; 
        var data = request.body; 
          company.updateOne({fieldId: getField},{$set: data}, (error, result) => {
          error 
            ? reject(err) 
            : resolve(result);
          })
      })
    }

    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    console.log('da sua 1 database theo linh vuc');
    response.json(result);

  } catch (e) {
    next(e)
  }
});
  
//delete data in company database by id
company_router.delete('/company/:id', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getid = request.params.id;
          company.deleteOne({_id: getid}, (error, result) => {
            error 
            ? reject(err) 
            : resolve(result);
          })
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
  
//delete data in company database by field id
company_router.delete('/company/field/:field',async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
          company.deleteOne({fieldId: getField}, (error, result) => {
            error 
            ? reject(err) 
            : resolve(result);
        })
      });
    };
    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    console.log('da xoa 1 database Company theo Linh Vuc ');
    response.json(result);

  } catch (e) {
    next(e)
  }
});

//save data in company database
company_router.post('/company', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var data = request.body;
        //data._id = request.body[1];
        var _Tempid = new ObjectID().toString();
        data._id=_Tempid; //vì data nhận vào là object nên ko thể push lên = bth, thay vào đó gọi tên
        company.insertOne(data, (error, result) => {
            error 
            ? reject(err) 
            : resolve({success:true});
          });
      })
    };
    //await myPromise
    var result = await myPromise();   
    
    //continue execution
    response.json(result);

  } catch (e) {
    next(e)
  }
});

//get full data in company database by field
company_router.get('/company/:field', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
        company.find({fieldId:getField}).toArray((error, result) => {
            error 
            ? reject(err) 
            : resolve({success:true,result:result});
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

//get full data in company database by field and page
company_router.get('/company/:field/:page', async (request, response,next) => {
  try {
    var myPromise = () => {
      return new Promise((resolve, reject) => {
        var getField = request.params.field;
        var getPage = request.params.page;
        company.find({Field:getField,Page:getPage}).toArray((error, result) => {
            error 
            ? reject(err) 
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

// Exports cho biến company_router
module.exports = company_router;