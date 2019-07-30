const cheerio = require('cheerio')
const superagent = require('superagent')
const puppeteer = require('puppeteer')
const fs = require('fs')

let keyword = ['景区管理','景区总经理','景区副总']

let job_mes = []
async function get_jobmes(){
    const browser = await puppeteer.launch({
        executablePath:'../Chromium.app/Contents/MacOS/Chromium'
    })
    const page = await browser.newPage();
    for(let j=0;j<keyword.length;j++){
        await page.goto(`https://sou.zhaopin.com/?jl=489&kw=${encodeURI(keyword[j])}`)
        await page.waitForSelector('.contentpile__content__wrapper__item__info__box__jobname__title')
        console.log('页面加载完毕')
        await page.focus('.soupager__pagebox__goinp')
        await page.keyboard.type('999999',{delay:300})
        const pagenum = await page.evaluate(()=>{
            let num = document.querySelector('.soupager__pagebox__goinp').value
            return num
        })
        console.log(pagenum)
        for(let i=0;i<pagenum;i++){
            console.log(`正在爬取${keyword[j]}职位第${i+1}页数据`)
            await page.goto(`https://sou.zhaopin.com/?jl=489&kw=${encodeURI(keyword[j])}&p=${i+1}`)
            await page.waitForSelector('.contentpile__content__wrapper__item__info__box__jobname__title')
            let arr = await page.evaluate(()=>{
                let title = document.querySelectorAll('.contentpile__content__wrapper__item__info__box__jobname__title')
                let href = document.querySelectorAll('.contentpile__content__wrapper__item__info')
                let prince = document.querySelectorAll('.contentpile__content__wrapper__item__info__box__job__saray')
                let company = document.querySelectorAll('.company_title')
                let mes_array = []
                title.forEach((item,index)=>{
                    mes_array.push({
                        title:title[index].innerText,
                        href:href[index].href,
                        prince:prince[index].innerText,
                        company:company[index].innerText,
                    })
                })
                // return document.querySelectorAll('.soupager__btn')[1].classList
                return mes_array
            })
            // console.log(hasNext(arr))
            job_mes = job_mes.concat(arr)
        }
    }
    console.log(`职位信息爬取完毕，共爬取职位${job_mes.length}个`)
    let hash = {}
    job_mes = job_mes.reduce((item,next)=>{
        hash[next.href] ? '' : hash[next.href] = true && item.push(next)
        return item
    },[])
    console.log(hash)
    console.log(`按详情页链接去重后职位数量为${job_mes.length}个`)
    outfile(job_mes)
    

}
get_jobmes()
function delay(time){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('end')
        },time)
    })
}
function outfile(data){
    fs.writeFile('./traveldata.json', JSON.stringify(data, null, 4), (err) => {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved suc! ");
        }
    });
}


