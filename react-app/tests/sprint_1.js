const { Builder, By, Key, until } = require('selenium-webdriver');

//Pre-requisitos: Ninguno.
//Entrada: El  usuario  hace  click  en  'Account',  se  mueve  a  la  sección 'Sign up' y completa los datos correctamente.
//Salida esperada: El usuario es redirigido sin ningún error al formulario de inicio de sesión.
describe('Sprint 1 - Prueba 1', function() {
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
  it('Sprint 1 - Prueba 1', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(1338, 817)
    await driver.findElement(By.id("dropdown-button-drop-left")).click()
    await driver.findElement(By.id("signupButton")).click()
    {
      const element = await driver.findElement(By.id("signupButton"))
      await driver.actions({ bridge: true }).move(element).perform()
    }
    await driver.findElement(By.name("email")).click()
    await driver.findElement(By.name("email")).sendKeys("Pedro" + Math.floor(Math.random() * 100) + "@gmail.com")
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("admin")
    await driver.findElement(By.name("confirmPassword")).click()
    await driver.findElement(By.name("confirmPassword")).sendKeys("admin")
    await driver.findElement(By.id("loginButton")).click()
    try {
      await driver.wait(until.elementTextIs(await driver.findElement(By.id("loginButton")), 'Login'), 30000)
    } catch (error) {
      await driver.wait(until.elementTextIs(await driver.findElement(By.id("loginButton")), 'Login'), 30000)
    }
  })
});