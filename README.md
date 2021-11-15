## HeyStream

La idea original surge del gran volumen de contenido en directo de streamers que
un usuario sigue en diversas plataformas y que no es capaz de consumir ya que se
tratan de transmisiones de múltiples horas de duración donde es imposible disfrutar
aunque sea de ciertos tramos interesantes del video una vez terminada la transmisión.

De esto surge HeyStream, una aplicación web híbrida que da una solución al gran
número de streamers y al volumen de contenidos, ya que permite a todos los usuarios
ver a todos los streamers en directo de todas las plataformas que sigan de un vistazo y,
además, ofrece la posibilidad de generar clips interesantes sobre directos finalizados.

## Manual de Instalación

***REQUISITOS SOFTWARE*** 

Previamente, será necesario disponer de los siguientes servicios y programas en nuestro equipo. Indicaré la versión que he utilizado para cada uno de ellos aunque el uso de una distinta (que esté más actualizada que la que use) no debería influir. 

- **Docker Desktop**. Conocido entorno de contenedores que permiten construir y compartir aplicaciones y microservicios como contenedores. Se ha usado la versión 20.10.6. Se puede descargar    desde su página oficial: https://docs.docker.com/desktop/ 
- **Node JS**. Entorno de ejecución para JavaScript. Se ha usado la versión 14.7.0. Se puede descargar desde su página oficial: https://nodejs.org/es/download/ 
 - **Python**. Python es un lenguaje de programación conocido por su simplicidad de aprendizaje y uso así como la gran cantidad de potentes librerías a su disposición. Se ha usado la versión de Python 3.9.0. Se puede descargar desde su página oficial: https://www.python.org/downloads/

Dicho esto, procederemos ahora a explicar cómo desplegar la aplicación. 

***PROCESO DE INSTALACIÓN*** 

**Pasos previos**

Lo primero que se requiere es descargar el código fuente del proyecto desde el siguiente enlace: https://github.com/pedcobram/HeyStream

**Dockerización de los servicios y base de datos**

Una vez se tiene el código fuente en el equipo así como todas las herramientas necesarias, vamos a asegurarnos de que Docker está corriendo en nuestra máquina, ya que el siguiente paso consiste en hacer uso de Docker para lanzar todos los servicios junto a la base de datos de forma simultanea. 

Para esto, desde la consola integrada en VS Code, que ha sido el editor de código usado a lo largo del proyecto, vamos a ejecutar el comando 'docker compose up' desde el directorio raíz del proyecto. Esto lo que hará es construir las imágenes de los servicios y de la base de datos según se ha definido previamente en el archivo 'docker compose.yml', este archivo define una serie de parámetros tales como dependencias sobre otros servicios, puerto expuesto o ruta del archivo 'Dockerfile' donde se definen los datos de construcción de cada servicio. 

**Puesta en marcha del front-end**

Una vez creados y lanzados tanto los servicios como la base de datos, es necesario lanzar ahora el front-end desde el que los usuarios harán uso de la web. 

A través de la consola integrada en VS Code, dentro de la carpeta llamada 'heystream', lanzamos el comando 'yarn watch' lo que compilará el código y una vez terminado expondrá el front-end al puerto 7001. 

Tras esto podemos acceder a la aplicación web desde la siguiente dirección en cualquier navegador web: http://localhost:7001
