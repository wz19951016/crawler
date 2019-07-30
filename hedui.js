const fs = require('fs')
const path = require('path')
const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('request')

var new_array = [],num = 1,flag = 0,logs = 0
function getjson_mes(){
    fs.readFile(path.join(__dirname,'notext.json'),'utf-8',(err,data)=>{
        if(err){
            console.log(err)
        }else{
            data = JSON.parse(data)
            console.log(data.length)
            
            async function loop(){
                for(let item of data){
                    console.log(`正在处理第${num}篇文章，共${data.length}篇文章`)
                    num++
                    await getdata(item)
                }
            }
            loop().then(s=>{
                console.log(new_array.length)
                console.log(logs)
                fs.writeFile('./notext_true.json', JSON.stringify(new_array, null, 4), (err) => {
                    if(err) {
                      console.log(err);
                    } else {
                      console.log("JSON saved suc! ");
                    }
                });
            })
        }
    })
}
function getdata(item){
    return new Promise((resolve,reject)=>{
        request.get(`http://127.0.0.1:3000/api/log?id=${item._id}`,(err,res,body)=>{
            if(err){
                console.log(err)
            }else{
                // console.log(item._id)
                flag = 0
                body = JSON.parse(body)
                // console.log(body.lists[0].o.$set.media)
                if(body.lists.length>1){
                    logs+=1
                }
                body.lists.forEach((item,index)=>{
                    if(item.o.$set.media&&item.o.$set.media.length>0){
                        item.o.$set.media.forEach(item=>{
                            if(item.type==='text'){
                                console.log('存在有text的media')
                                flag = 1
                            }
                        })
                    }
                })
               
                if(flag === 1){
                    new_array.push(item)
                }
                resolve('success')
            }
        })
    })
}
getjson_mes()