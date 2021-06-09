const { Builder, By, Key, until } = require('selenium-webdriver')

describe('Sprint 4 - Prueba 3', function() {
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
  it('Sprint 4 - Prueba 3', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(1582, 702)
    await driver.findElement(By.id("myStreams")).click()
    await driver.findElement(By.id("input")).click()
    await driver.findElement(By.id("input")).sendKeys("mizkif")
    await driver.findElement(By.id("loginButton")).click()
    await driver.wait(until.elementLocated(By.css(".sc-kEjbxe:nth-child(3) .queryImage")), 30000)
  })
})