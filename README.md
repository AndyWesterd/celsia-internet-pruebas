# PTCrud

## Ejecucion con Docker

El proyecto incluye `Dockerfile` para `api` y `webapp`, y un `docker-compose.yml` en la raiz para levantar backend, frontend y PostgreSQL juntos.

Opcionalmente se puede crear un archivo `.env` en la raiz tomando como base `.env.example`:

```bash
cp .env.example .env
```

Docker Compose lee automaticamente ese `.env` de la raiz para reemplazar variables como puertos, credenciales de base de datos y URL de la API. El archivo `api/.env` sigue siendo util si ejecutamos el backend por fuera de Docker.

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api`
- PostgreSQL: `localhost:5432`

Para detener los contenedores:

```bash
docker compose down
```

Para eliminar los datos guardados de PostgreSQL:

```bash
docker compose down -v
```

# Prueba teorico practica:

-¿Que mecanismos de seguridad incluirias en la aplicacion para garantizar la proteccion del acceso a los datos?
 
RTA: Para garantizar la protección del acceso a los datos en la aplicación, incluiría varios mecanismos de seguridad. primero, implementaría autenticación de usuarios, para que solo las personas autorizadas puedan ingresar al sistema, utilizando usuarios y contraseñas seguras, e incluso autenticación de dos factores si es posible. segundo, aplicaría control de acceso basado en roles, de manera que cada usuario solo pueda realizar las acciones que le correspondan. Tambien validaría todas las entradas de datos para prevenir ataques como la inyección SQL, utilizando consultas parametrizadas y verificando la información ingresada por el usuario, tambien se podria cifrar los datos sensibles como contraseñas y datos personales tanto en la bd y durante la transmision de los datos mediante el protocolo https.

-¿Qué estrategia de escalabilidad recomendarías para la aplicación considerando que el crecimiento proyectado será de 1,000,000 de clientes por año?

RTA: Recomendaría una estrategia de escalabilidad horizontal, ya que permite agregar nuevos servidores o instancias a medida que aumenta la cantidad de usuarios, sin afectar el funcionamiento de la aplicación. Esta opcion es mas flexible que depender de un único servidor con mayor capacidad. Podriamos inplementar tambien un balanceador de carga para distribuir las solicitudes entre varios servidores y evitar la sobrecarga en uno solo, tambien podriamos implementar un almacenamiento en cache para reducir el tiempo de respuesta de las consultas que hacemos con frecuencia.

-¿Qué patrón o patrones de diseño recomendarías para esta solución y
cómo se implementarían? (Justifique)

RTA: Recomendaria el patrón MVC (Modelo-Vista-Controlador), ya que permite organizar la aplicacion separando la logica de negocio, la interfaz de usuario y el acceso a los datos. El Modelo se encargaría de gestionar la información de clientes y servicios, la Vista mostraría los datos al usuario y el Controlador recibiria las solicitudes y coordinaría la comunicación entre el modelo y la vista. con este patron tendriamos una escalabilidad del sistema. Tambien implementariamos un patron tipo DAO (Data Access Object) para manejar el acceso a la base de datos. Con esto todas las dependencias de la aplicacion de crear , consultar, actualizar y eliminar se realizan a través de clases específicas de acceso a datos, evitando que la logica de negocio dependa directamente de la base de datos. Esto hace que el codigo sea más organizado, reutilizable y sencillo de modificar si en el futuro decidieramos cambiar la bd.

-¿Qué recomendaciones harías para optimizar el manejo y la persistencia de datos de la aplicación, teniendo en cuenta que esta aplicación tiene una alta transaccionalidad?

RTA: Recomendaria emplear un sistema de caché para almacenar temporalmente la información que se consulta con mayor frecuencia, disminuyendo la carga sobre la base de datos. Asimismo, consideraría la replicación de la base de datos para distribuir las consultas de lectura y mejorar el rendimiento, y la partición de datos (sharding) si el volumen de información crece considerablemente.


REDES: 

-Explica la diferencia entre un router y un switch. ¿Cuándo usarías cada uno?

RTA: La diferencia principal basicamente es que  el router conecta tu red con otras redes o con internet, mientras que el switch conecta multiples dispositivos entre si para formar la red local. 

Usaria un switch para conectar dispositivos dentro de una misma red local y un router cuando sea necesario conectar esa red con otras redes, especialmente con Internet.

- Describe las siete capas del modelo OSI y menciona brevemente la función principal de cada una.

RTA:  
1 Capa Fisica: Se encarga de transmitir los bits a traves del medio fisico, como cables, fibra optica o señales inalambricas.

2 Capa de Enlace de Datos: Controla la comunicación entre dispositivos de la misma red, detecta errores y utiliza direcciones MAC para entregar correctamente los datos.

3 Capa de Red: Se encarga del direccionamiento logico mediante direcciones IP y determina la mejor ruta para que los paquetes lleguen a su destino.

4 Capa de Transporte: Garantiza la entrega correcta y ordenada de los datos, controlando el flujo de informacion y la recuperacion ante errores. Protocolos como TCP y UDP trabajan en esta capa.

5 Capa de Sesión: Establece, mantiene y finaliza las sesiones de comunicación entre dos dispositivos o aplicaciones.

6 Capa de Presentación: Se encarga de traducir el formato de los datos, realizar el cifrado y descifrado, y la compresión para que la información pueda ser entendida por ambos extremos.

7 Capa de Aplicación: Es la capa más cercana al usuario y proporciona los servicios de red que utilizan las aplicaciones, como el correo electrónico, la navegación web y la transferencia de archivos.

- Explica las diferencias entre los protocolos TCP y UDP. Dar un ejemplo
de cuándo usarías cada uno?

RTA: La diferencia principal radica basicamente en que el protocolo TCP se utiliza cuando se requiere seguridad y confiabilidad en la transmisión de datos, mientras que UDP es la mejor opcion cuando se necesita rapidez y baja latencia. 

Utilizaria TCP cuando: Haga envio de correos electrónicos, las transacciones bancarias o la transferencia de archivos, ya que es importante que los datos lleguen completos.

Utilizaria UDP cuando: Haga transmisiones de video en vivo, juegos en linea o llamadas por Internet, donde una pequeña perdida de información no afecta significativamente la experiencia del usuario.

- ¿Qué es una máscara de subred y cómo se utiliza para dividir una red en
subredes más pequeñas?

RTA: Una mascara de subred es un numero que se utiliza junto con una dirección IP para identificar que parte de la dirección corresponde a la red y cuál corresponde a los dispositivos (hosts).

Al utilizar una mascara de subred tomariamos algunos bits que originalmente los teniamos destinados al host y los utilizariamos para crear nuevas subredes.


