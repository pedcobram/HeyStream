const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Sprint 3 - Prueba 1', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('Sprint 3 - Prueba 1', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(1338, 817)
    await driver.wait(until.elementLocated(
      By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")), 30000)
    await driver.findElement(By.css(".centered:nth-child(4) > .sc-kEjbxe:nth-child(1) img")).click()
    await driver.findElement(By.xpath("//div[@id=\'app\']/div/div/div/div[2]/a")).click()
    await driver.wait(until.elementLocated(By.css(".sc-kEjbxe:nth-child(1) img")), 30000)
    {
      const elements = await driver.findElements(By.xpath("//div[@id=\'app\']/div/div/div[2]/div/div/a/img"))
      assert(elements.length)
    }
  })
})

describe('Sprint 3 - Prueba 2', function() {
    this.timeout(30000)
    let driver
    let vars
    beforeEach(async function() {
      driver = await new Builder().forBrowser('chrome').build()
      vars = {}
    })
    afterEach(async function() {
      await driver.quit();
    })
    it('Sprint 3 - Prueba 2', async function() {
      await driver.get("http://localhost:7001/")
      await driver.manage().window().setRect(1338, 817)
      await driver.wait(until.elementLocated(
        By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")), 30000)
      await driver.findElement(By.css(".centered:nth-child(4) > .sc-kEjbxe:nth-child(1) img")).click()
      await driver.findElement(By.xpath("//div[@id=\'app\']/div/div/div/div[2]/a")).click()
      await driver.wait(until.elementLocated(By.xpath("//div[2]/div/a/img")), 30000)
      await driver.findElement(By.css(".sc-kEjbxe:nth-child(2) img")).click()
      vars["vodtitle"] = await driver.findElement(By.css("h3")).getText()
      assert(await driver.findElement(By.css("h3")).getText() == vars["vodtitle"])
    })
  })