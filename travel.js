const { Wechaty } = require('wechaty')
const Qrcode = require('qrcode-terminal')
const schedule = require('node-schedule')
const superagent = require('superagent')
const cheerio = require('cheerio')

const bot = new Wechaty()

let weather_array = [`https://tianqi.moji.com/weather/china/anhui/tunxi-district`,`https://tianqi.moji.com/weather/china/anhui/yi-county`,`https://tianqi.moji.com/weather/china/anhui/huangshan-scenic-area`,`https://tianqi.moji.com/weather/china/anhui/tunxi-district`]
let plan_array = [`**行程安排**<br/>10：30 —— 17：12 火车：北京南-黄山北<br/>火车北站打车到屯溪老街，大约半小时左右<br/>18：00 —— 21：30 逛屯溪老街+黎阳in巷+吃饭<br/>22：00 入住黄山老街壹号陌上客栈（黄山屯溪区屯溪老街6号）<br/>**交通方式**<br/>出租车（黄山北站到屯溪老街）<br/>**美食 **<br/>黄山烧饼，小馄饨，毛豆腐，臭鳜鱼<br/>**购物**<br/>黎阳in巷更文艺小资一点，可以逛逛买一些明信片之类的做纪念<br/>**住宿**<br/>入住黄山老街壹号陌上客栈（黄山屯溪区屯溪老街6号）`,
                  `**行程安排**<br/>9点前到达屯溪汽车站，坐大巴前往宏村<br/>下午3点前前往宏村大桥包车前往焦村镇<br/>下午5点前入住黄山慢悠悠客栈<br/>下午到晚上在焦村镇逛逛，买第二天上山需要的食品水<br/>**交通方式**<br/>大巴（屯溪汽车站到宏村）<br/>出租车（宏村到焦村）<br/>**住宿**<br/>黄山慢悠悠客栈`,
                  `**行程安排**<br/>8点前到达西大门售票处（坐客栈门口到西大门的班车）<br/>下午5点左右从南大门下山到汤口镇，乘坐大巴返回黄山北站<br/>**爬山路线**<br/>西大门爬山——经过钓桥庵/三溪口途径步仙桥，到达天海——光明顶（休息一下补充能量）——向鳌鱼峰方向出发——经过鳌鱼洞/百步云梯到达莲花峰——玉屏楼——迎客松——游览完迎客松从玉屏楼索道到达汤口<br/>**交通方式**<br/>班车（慢悠悠客栈到西大门售票处）<br/>大巴（返回高铁北站，下午18：00在黄山风景区汽车站发车）<br/>**住宿**<br/>入住似水流年客栈（群联村19-1号）`,
                  `**行程安排**<br/>火车发车时间14：47，14：10到达火车北站，之前时间自由安排`
                 ]
function scan(qrcode){
    Qrcode.generate(qrcode)
    let ewm = ['https://api.qrserver.com/v1/create-qr-code/?data=',encodeURIComponent(qrcode),'&size=220x220&margin=20',].join('')
    console.log(ewm)
}
function getarray_index(){
    return new Promise((resolve,reject)=>{
        let time = new Date()
        let date = time.getDate()
        let index = -1
        switch(date){
            case 30:
                index = 0
                break;
            case 1:
                index = 1
                break;
            case 2:
                index = 2
                break;
            case 3:
                index = 3
                break;
        }
        console.log(index)
        resolve(index)
    })
}
async function sendmes(){
    const index = await getarray_index()
    let str1 = await get_weather(weather_array[index])
    let nickname = '水湄而有桥'
    let contact = await bot.Contact.find({name:nickname})
    let str = `最美的风景是陪你旅行的人~<br/><br/>${plan_array[index]}<br/><br/>${str1}`
    await contact.say(str)
}
function get_weather(url){
    return new Promise((resolve,reject)=>{
        superagent.get(url).end((err,pres)=>{
            let $ = cheerio.load(pres.text)
            let tomorrow_item = $('.forecast .days').eq(1)
            let weather = $(tomorrow_item).find('li').eq(1).text().trim()
            let tem = $(tomorrow_item).find('li').eq(2).text().trim()
            let air = $(tomorrow_item).find('li').eq(4).find('strong').text().trim()
            console.log(weather)
            console.log(tem)
            console.log(air)
            let weather_str = `明日天气：${weather}<br/>温度：${tem}<br/>空气质量:${air}`
            resolve(weather_str)
        })
    })
}
bot.on('scan',    (qrcode, status) => {scan(qrcode)})
bot.on('login',   user => { 
    console.log(`User ${user} logined`)
    var j = schedule.scheduleJob('00 22 * * *', function(){
        sendmes()
    });
})
bot.start()