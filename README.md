# p4-t2-networking-alu0101018300

# Práctica 4 - Networking.

Los servicios de red tienen como objetivos conectar dos puntos y transmitir informacion entre ellos, sin importar que tipo de información estemos transmitiendo, pero teniendo en cuenta que deberemos hacer una conexión primero.

## Enlace de un servidor a un puerto TCP.

La conexión de un Socket TCP consiste en dos puntos finales. Un punto final se une a un puerto numerado mientras que el otro se conecta a un puerto. Básicamente, esto funciona como los sistemas telefónicos. En Node las operaciones de enlace y conexión son proporcionadas por el módulo net.

El método net.createServer devuelve un objeto servidor mediante una callback. La callback se invoca cuando se conecta otro punto. El parámetro de conexión es un objecto Socket, además el método server.listen nos permite escuchar por el puerto indicado.

## Escribir datos en un Socket.

![net-watcher_js](https://user-images.githubusercontent.com/44870064/54293991-c9902480-45a8-11e9-8b37-d70370d51790.png)

En este caso, vamos a utilizar el programa anterior, al que llamaremos net-watcher.js, al que le pasamos el nombre del fichero a observar como argumento y devolvera un error personalizado en caso de que no le pasemos algo correcto.

Con el método connection.write podemos escribir en el cliente y con watcher.close cerramos la conexión.

Invocamos server.listen cuando se enlaza correctamente con el puerto especificado y esta listo para recibir conexiones.

Para probar el prograa anterior necesitaremos 3 terminales:
- Una que hará de servidor
- Una que hará de cliente
- Una para modificar el fichero

En una terminal y mediante el comando usaremos el comando #watch -n 1 touch target.txt para modificar el fichero cada segundo.
En la segunda, ejecutaremos el servidor node #net-watcher.js target.txt y por último, usaremos Netcat para conectarnos. Usaremos #nc localhost 60300.

![ejecucion_net_watcher](https://user-images.githubusercontent.com/44870064/54293974-c7c66100-45a8-11e9-98ab-909b04477a92.png)

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

![net_watcher_json_code](https://user-images.githubusercontent.com/44870064/54293994-ca28bb00-45a8-11e9-9d3e-e4f741a5ff2e.png)

Ahora ejecutamos este archivo quedando la ejecucion de la siguiente manera:

![net-watcher-jason](https://user-images.githubusercontent.com/44870064/54293990-c9902480-45a8-11e9-85d7-10c7d1fd1e57.png)

## Creación de cliente de conexiones sockets.

![net_watcher_json_client_code](https://user-images.githubusercontent.com/44870064/54293993-c9902480-45a8-11e9-87ac-8758f9411930.png)

Este programa es un pequeño cliente que utiliza net.connect para crear una conexión cliente en el puerto especificado del localhost. Cuando llega algún dato es parseado y se muestra adecuadamente por consola.

![net-watcher-json-client](https://user-images.githubusercontent.com/44870064/54293992-c9902480-45a8-11e9-9ba6-5e04fc21965f.png)

## Problema del límite de mensajes.

En el mejor de los casos los mensajes llegarán a la vez. El problema es que a veces llegaran en diferentes pedazos de datos. Necesitamos lidiar con este problema cuando ocurra.

El protocolo LDJ que desarrollamos anteriormente separa los mensajes con nuevas lineas. Quedando el codigo de la siguiente manera:

![ldj_code](https://user-images.githubusercontent.com/44870064/54293988-c8f78e00-45a8-11e9-94f1-f7d05b05f42e.png)

## Implementando un servicio de pruebas.

Implementaremos un servicio de pruebas que divide a propósito un mensaje en múltiples partes.

El programa cliente tiene dos tareas que hacer. Una es almacenar los datos entrantes en mensajes. La otra es manejar cada mensaje cuando llega. Lo correcto es convertir al menos uno de ellos en un módulo. Extender EventEmitter.

Para liberar al programa cliente del peligro de dividir los mensajes JSON, implementaremos un módulo de cliente de buffer LDJ.
Herencia en Node.

## Eventos de datos de almacenamiento en buffer.

![ldj_client_primitive_code](https://user-images.githubusercontent.com/44870064/54293978-c85ef780-45a8-11e9-923d-eb73587d0e91.png)

## Exportando funcionalidad en un módulo

![ldj-client_add](https://user-images.githubusercontent.com/44870064/54293976-c85ef780-45a8-11e9-8f00-22b9af0dab1a.png)

Dentro de la definición de clase, después del constructor, estamos agregando un método estático llamado connect.

El código para usar el módulo sería algo como esto

## Importando un módulo Node.js

![net-watcher-ldj-client_code](https://user-images.githubusercontent.com/44870064/54293995-ca28bb00-45a8-11e9-9482-662a9fd29040.png)
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

![ldj_client_test_code](https://user-images.githubusercontent.com/44870064/54293981-c8f78e00-45a8-11e9-9598-e6f36bb76dce.png)

### Ejecución.

Para poder ejecutar tenemos que añadir en el package.json lo siguiente en la sección test: "test": "mocha"

A continuación, ejecutamos con el comando #npm test.

![mocha](https://user-images.githubusercontent.com/44870064/54288363-428a7e80-459f-11e9-9dd2-d3b349633752.png)

## Ejercicio Testability y Robustness

Para el desarrollo de la práctica se nos ha pedido realizar más ficheros de prueba para algunos casos determinados:
- Prueba divide el mensaje en dos partes para ser emitidas por el stream uno después del otro.

![ldj-client-test-split](https://user-images.githubusercontent.com/44870064/54293986-c8f78e00-45a8-11e9-8e31-193186aac0dc.png)

- Prueba que pasa un objecto nulo y detecta el error.

![ldj-client-test-null](https://user-images.githubusercontent.com/44870064/54293984-c8f78e00-45a8-11e9-9025-40142ee69f28.png)

-Prueba para enviar y detectar el error de pasar un mensaje que no es JSON.

![ldj_client_test_not_json](https://user-images.githubusercontent.com/44870064/54293983-c8f78e00-45a8-11e9-8f54-e3af1946046f.png)

- Prueba que en case de falta del último salto de linea lo que pasa es que se quedará esperando y nunca emitirá el mensaje. Para poder manejar esta situación implementamos un evento close que comprobará si existe o no un \n al final del JSON. En caso de no existir lanza el error o, en caso contrario, emite el mensaje.

![ldj_client_test_close](https://user-images.githubusercontent.com/44870064/54293980-c85ef780-45a8-11e9-8be9-b78324f824cf.png)

Para que estas pruebas tengan un correcto funcionamiento hemos tenido que modificar el fichero ldj-client para que las pruebas se pudieran realizar correctamente, quedando de la siguiente manera:

![ldj_client_code_complete](https://user-images.githubusercontent.com/44870064/54293977-c85ef780-45a8-11e9-877e-a288a2134e74.png)

## Resultado de los tests

Tras realizar todos los ficheros de pruebas y modificar el fichero ldj-client.js realizamos de nuevo las pruebas y vemos los resultados de las mismas:

![test](https://user-images.githubusercontent.com/44870064/54294000-cac15180-45a8-11e9-8173-fbeab8d812be.png)

## Travis
[![Build Status](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-alu0101018300.svg?branch=master)](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-alu0101018300)

![travis_ok](https://user-images.githubusercontent.com/44870064/54294006-cbf27e80-45a8-11e9-94ca-a7e22b7fb7b3.png)

## Reto
Como reto se nos pidio que realizaramos un chat, quedando el codigo del mismo de la siguiente manera:

![reto_code](https://user-images.githubusercontent.com/44870064/54293996-ca28bb00-45a8-11e9-90ef-595cfaf48094.png)



