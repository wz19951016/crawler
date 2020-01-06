const puppeteer = require('puppeteer')
const fs = require('fs')

async function saveImage(){
  const browser = await puppeteer.launch({
    executablePath:'../Chromium.app/Contents/MacOS/Chromium'
  })
  const page = await browser.newPage();
  await page.goto(`data:image/svg+xml;charset=utf-8,%0A  <svg xmlns="http://www.w3.org/2000/svg">%0A    <foreignObject width="100" height="100">%0A      <body xmlns="http://www.w3.org/1999/xhtml" style="padding:0;margin:0">%0A        <p style="font-size:16px;margin:0;padding:0;word-break: break-word;line-height:1.5em;font-familt:sans-serif;">%E4%B8%80%E6%AE%B5%E9%9C%80%E8%A6%81word wrap%E7%9A%84%E6%96%87%E5%AD%97wewewewewewewe.%E6%8B%9B%E9%A3%8E%E8%80%B3%E5%8F%91%E7%9A%84%E9%A1%BA%E4%B8%B0%E5%88%B9%E8%BD%A6%E9%98%BF%E6%96%AFUC%E9%98%BF%E6%96%AF%E9%86%8B%E8%BF%98%E6%98%AF%E5%92%8C%E8%8F%9C%E5%B8%82%E5%9C%BA%E5%95%8A%E5%AE%89%E5%A3%AB%E6%89%8D%E5%90%93%E6%AD%BB%E5%81%B6%E4%BC%9A %E6%9A%97%E7%A4%BA%E6%93%A6%E5%95%A5%E6%98%AF%E8%B5%A4%E5%A3%81%E5%93%A6</p>%0A      </body>%0A    </foreignObject>%0A  </svg>`)
  await page.waitForSelector('p')
  page.screenshot({
    path : 'test.png',
    clip:{
      x : 0,
      y : 0,
      width : 100,
      height : 100
    },
    omitBackground : true
  })
}
saveImage()