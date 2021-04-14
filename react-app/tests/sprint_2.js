const { Builder, By, Key, until } = require('selenium-webdriver');

//Pre-requisitos: Ninguno
//Entrada: El  usuario  hace  click  en  'Account',  se  mueve  a  la  sección 'Sign up' y completa los datos correctamente
//Salida esperada: El usuario es redirigido sin ningún error al formulario deinicio de sesión
describe('Sprint 2 - Prueba 1', function() {
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
    it('Sprint 2 - Prueba 1', async function() {
      await driver.get("http://localhost:7001/")
      await driver.manage().window().setRect(945, 1020)
      await driver.wait(until.elementLocated(By.className("centered sc-bdVaJa eHjUkg")), 30000)
      await driver.wait(until.elementLocated(By.className("centered sc-bdVaJa eHjUkg")), 30000)
    })
});

//Pre-requisitos: Ninguno
//Entrada: El usuario hace click sobre alguno de los directos de la página inicial
//Salida esperada: Es redirigido a una vista en la que se cargará el directo y su chat correspondiente
describe('Sprint 2 - Prueba 2', function() {
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
    it('Sprint 2 - Prueba 2', async function() {
      await driver.get("http://localhost:7001/")
      await driver.manage().window().setRect(945, 1020)
      await driver.wait(until.elementLocated(By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")), 30000)
      await driver.findElement(By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")).click()
    })
});

//Pre-requisitos: Ninguno
//Entrada: El usuario hace click sobre uno de los filtros mostrados en la página inicial
//Salida esperada: Se eliminan los directos que no pertenezcan a la categoría seleccionada
describe('Sprint 2 - Prueba 3', function() {
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
  it('Sprint 2 - Prueba 3', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(1936, 1056)
    await driver.findElement(By.xpath("//button[contains(.,\'Twitch\')]")).click()
    await driver.wait(until.elementLocated(By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")), 30000)
    await driver.findElement(By.xpath("//button[contains(.,\'YouTube\')]")).click()
    await driver.wait(until.elementLocated(By.xpath("//img[contains(@src,\'https://i.ytimg.com\')]")), 30000)
  })
})

//Pre-requisitos: Tener una cuenta con al menos una cuenta ligada
//Entrada: El usuario entra a la vista de sus directos
//Salida esperada: Se cargarán todos los directos de las plataformas en las que haya ligado su cuenta
describe('Sprint 2 - Prueba 4', function() {
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
  it('Sprint 2 - Prueba 4', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(945, 1020)
    await driver.findElement(By.id("dropdown-button-drop-left")).click()
    await driver.findElement(By.name("email")).click()
    await driver.findElement(By.name("email")).sendKeys("pedro.cobos197@gmail.com")
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("admin")
    await driver.findElement(By.id("loginButton")).click()
    await driver.wait(until.elementLocated(By.linkText("My Streams")), 30000)
    await driver.findElement(By.linkText("My Streams")).click()
    await driver.wait(until.elementLocated(By.css(".sc-bqyKva:nth-child(9)")), 30000)
    await driver.wait(until.elementLocated(By.css(".sc-bqyKva:nth-child(5)")), 30000)
  })
});

//Pre-requisitos: Tener una cuenta con al menos una cuenta ligada
//Entrada: El usuario se loguea, entra a la vista de sus directos y hace click sobre el primer filtro
//Salida esperada: Se filtran los directos y tan solo aparecen los de la plataforma seleccionada, eliminando el resto
describe('Sprint 2 - Prueba 5', function() {
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
  it('Sprint 2 - Prueba 5', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(945, 1020)
    await driver.findElement(By.id("dropdown-button-drop-left")).click()
    await driver.findElement(By.name("email")).click()
    await driver.findElement(By.name("email")).sendKeys("pedro.cobos197@gmail.com")
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("admin")
    await driver.findElement(By.id("loginButton")).click()
    await driver.wait(until.elementLocated(By.id("myStreams")), 30000)
    await driver.findElement(By.id("myStreams")).click()
    await driver.wait(until.elementLocated(By.xpath("//img[contains(@src,\'https://static-cdn.jtvnw.net/previews-ttv\')]")), 30000)
  })
})

//Pre-requisitos: Tener una cuenta con al menos una cuenta ligada
//Entrada: El usuario se loguea, entra a la vista de sus directos y hace click sobre el primer filtro
//Salida esperada: Se filtran los directos y tan solo aparecen los de la plataforma seleccionada, eliminando el resto
describe('Sprint 2 - Prueba 6', function() {
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
  it('Sprint 2 - Prueba 6', async function() {
    await driver.get("http://localhost:7001/")
    await driver.manage().window().setRect(945, 1020)
    await driver.findElement(By.id("dropdown-button-drop-left")).click()
    await driver.findElement(By.name("email")).click()
    await driver.findElement(By.name("email")).sendKeys("pedro.cobos197@gmail.com")
    await driver.findElement(By.name("password")).click()
    await driver.findElement(By.name("password")).sendKeys("admin")
    await driver.findElement(By.id("loginButton")).click()
    await driver.wait(until.elementLocated(By.id("myStreams")), 30000)
    await driver.findElement(By.id("myStreams")).click()
  })
});