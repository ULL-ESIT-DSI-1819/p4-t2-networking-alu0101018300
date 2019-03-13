# p4-t2-networking-alu0101018300

# Práctica 4 - Networking.

Los servicios de red tienen como objetivos conectar dos puntos y transmitir informacion entre ellos, sin importar que tipo de información estemos transmitiendo, pero teniendo en cuenta que deberemos hacer una conexión primero.

## Enlace de un servidor a un puerto TCP.

La conexión de un Socket TCP consiste en dos puntos finales. Un punto final se une a un puerto numerado mientras que el otro se conecta a un puerto. Básicamente, esto funciona como los sistemas telefónicos. En Node las operaciones de enlace y conexión son proporcionadas por el módulo net.

El método net.createServer devuelve un objeto servidor mediante una callback. La callback se invoca cuando se conecta otro punto. El parámetro de conexión es un objecto Socket, además el método server.listen nos permite escuchar por el puerto indicado.

## Escribir datos en un Socket.

captura net-watcher.js

En este caso, vamos a utilizar el programa anterior, al que llamaremos net-watcher.js, al que le pasamos el nombre del fichero a observar como argumento y devolvera un error personalizado en caso de que no le pasemos algo correcto.

Con el método connection.write podemos escribir en el cliente y con watcher.close cerramos la conexión.

Invocamos server.listen cuando se enlaza correctamente con el puerto especificado y esta listo para recibir conexiones.

Para probar el prograa anterior necesitaremos 3 terminales:
- Una que hará de servidor
- Una que hará de cliente
- Una para modificar el fichero

En una terminal y mediante el comando usaremos el comando #watch -n 1 touch target.txt para modificar el fichero cada segundo.
En la segunda, ejecutaremos el servidor node #net-watcher.js target.txt y por último, usaremos Netcat para conectarnos. Usaremos #nc localhost 60300.

captura ejecucion_net_watcher

## Escuchando en Sockets Unix.

Para ver como funciona net en los sockets Unix modificaremos el programa anterior,Cambiando el listen final por listen(‘/tmp/watcher.sock’, () => console.log(‘Listening for subscribers...’));.

Este archivo lo guardamos como net-watcher-unix.js.

Este lo ejecutaremos igual que la anterior pero al nc le añadiremos la opción -U seguido de /tmp/watcher.sock.
Los sockets Unix pueden ser más rápidos que los sockets TCP porque no requieren invocar al hardware de red.

## Serialización de mensajes con JSON.

Un protocolo es un conjunto de reglas que definen como se comunican los puntos en un sistema. En Node estaremos trabajando con uno o más protocolos. Vamos a crear un protocolo basado en pasar mensajes JSON a través de TCP.
Cada mensaje será un objeto serializado JSON. Basicamente es un hash clave - valor.
El servicio net-watcher que hemos creado envía dos tipos de mensajes que necesitamos convertir a JSON:

- Cuando la conexión se establece por primera vez.
- Cuando el fichero se modifica.

Podemos codificar el primer tipo de la siguiente manera:

- {“type”: “watching”, “file”: “target.txt”}

Y el segundo de la siguiente:

- {“type”: “changed”, “timestamp”: 1358175733785} El campo timestamp contiene un valor entero que representa el número de milisegundos desde la medianoche del 1 de enero de 1970. Podemos obtener la fecha actual con Date.now.

### Cambiando a mensajes JSON.

A continuación modificamos el servicio net-watcher para emplear el protocolo que hemos definido.

La modificación la haremos en conection.write, quedando el fichero de la siguiente manera:

captura net_watcher_json_code

Ahora ejecutamos este archivo quedando la ejecucion de la siguiente manera:

captura net_watcher_json

## Creación de cliente de conexiones sockets.

captura net_watcher_json-client

Este programa es un pequeño cliente que utiliza net.connect para crear una conexión cliente en el puerto especificado del localhost. Cuando llega algún dato es parseado y se muestra adecuadamente por consola.

captura net_watcher_client_json

## Problema del límite de mensajes.

En el mejor de los casos los mensajes llegarán a la vez. El problema es que a veces llegaran en diferentes pedazos de datos. Necesitamos lidiar con este problema cuando ocurra.

El protocolo LDJ que desarrollamos anteriormente separa los mensajes con nuevas lineas. Quedando el codigo de la siguiente manera:

captura ldj_code

## Implementando un servicio de pruebas.

Implementaremos un servicio de pruebas que divide a propósito un mensaje en múltiples partes.

El programa cliente tiene dos tareas que hacer. Una es almacenar los datos entrantes en mensajes. La otra es manejar cada mensaje cuando llega. Lo correcto es convertir al menos uno de ellos en un módulo. Extender EventEmitter.

Para liberar al programa cliente del peligro de dividir los mensajes JSON, implementaremos un módulo de cliente de buffer LDJ.
Herencia en Node.

## Eventos de datos de almacenamiento en buffer.

captura cliente_ldj_primitive_code

## Exportando funcionalidad en un módulo

captura ldj-client_add

Dentro de la definición de clase, después del constructor, estamos agregando un método estático llamado connect.

El código para usar el módulo sería algo como esto

## Importando un módulo Node.js

captura net-watcher-ldj-client-code

La principal diferencia respecto a lo anterior es que, en lugar de enviar buffers de datos directamente a JSON.parse , este programa se basa en el módulo ldj-client para producir eventos de mensajes. Finalmente, ejecutamos el servidor de pruebas y el nuevo cliente.

## Desarrollando pruebas con Mocha.

Mocha es un marco de pruebas para Node. Lo instalamos con npm y desarrollamos diferentes pruebas para LDJClient.

### Instalación de Mocha.

- En la carpeta networking generamos un JSON con npm init -y.
- Posteriormente instalamos mocha con npm install --save-dev --save-exact mocha@3.4.2.

Se habrá creado un directorio llamado node_modules que contiene mocha y sus dependencias.

Además, el fichero package.json contiene ahora una linea de dependencia de mocha.

## Test con Mocha.

Creamos un subdirectorio llamado test que es donde por defecto Mocha buscará.

Desarrollamos un fichero de pruebas, quedando su código de la siguiente manera:

captura ldj_client_test_code

### Ejecución.

Para poder ejecutar tenemos que añadir en el package.json lo siguiente en la sección test: "test": "mocha"

A continuación, ejecutamos con el comando #npm test.

captura mocha_1

## Ejercicio Testability y Robustness

Para el desarrollo de la práctica se nos ha pedido realizar más ficheros de prueba para algunos casos determinados:
- Prueba divide el mensaje en dos partes para ser emitidas por el stream uno después del otro.

captura ldj-client-test-split

- Prueba que pasa un objecto nulo y detecta el error.

captura ldj-client-test-null

-Prueba para enviar y detectar el error de pasar un mensaje que no es JSON.

captura ldj-client-test-not-json

- Prueba que en case de falta del último salto de linea lo que pasa es que se quedará esperando y nunca emitirá el mensaje. Para poder manejar esta situación implementamos un evento close que comprobará si existe o no un \n al final del JSON. En caso de no existir lanza el error o, en caso contrario, emite el mensaje.

captura ldj-client-test-close

Para que estas pruebas tengan un correcto funcionamiento hemos tenido que modificar el fichero ldj-client para que las pruebas se pudieran realizar correctamente, quedando de la siguiente manera:

captura ldj_client_complete_code

## Resultado de los tests

Tras realizar todos los ficheros de pruebas y modificar el fichero ldj-client.js realizamos de nuevo las pruebas y vemos los resultados de las mismas:

captura test

## Travis
[![Build Status](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-alu0101018300.svg?branch=master)](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-alu0101018300)

captura travis_bien
