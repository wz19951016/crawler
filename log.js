const fs = require('fs')
const path = require('path')
const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('request')

var new_array = [],num = 1,flag = 0,no_art=0
function getjson_mes(){
    fs.readFile(path.join(__dirname,'logdata.json'),'utf-8',(err,data)=>{
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
                console.log(no_art)
                fs.writeFile('./notext.json', JSON.stringify(new_array, null, 4), (err) => {
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
        request.get(`http://guide.tangshui.net/post/jiutestjson/${item._id}`,(err,res,body)=>{
            if(err){
                console.log(err)
            }else{
                console.log(item._id)
                flag = 0
                body = JSON.parse(body)?JSON.parse(body):{media:[]}
                console.log(body)
                if(body.media&&body.media.length>0){
                    body.media.forEach(item=>{
                        if(item.type==='text'){
                            flag = 1
                        }
                    })
                }
                if(flag === 0){
                    new_array.push(item)
                }
                if(body.type!=='post'){
                    no_art+=1
                }
                resolve('success')
            }
        })
    })
}
getjson_mes()