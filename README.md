
# Telegram Bot con Telegraf y ExcelJS

Este bot de Telegram registra los mensajes de los usuarios en un archivo Excel y permite la descarga del archivo.

## Requisitos

- Node.js
- npm
- Una cuenta en Telegram y un bot creado con el BotFather

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en el directorio raíz del proyecto y añade tu token de bot de Telegram:

```
BOT_TOKEN=tu_token_de_telegram
```

4. Ejecuta el bot:

```bash
node bot.js
```

## Uso

### Comando /start

Inicia la interacción con el bot. El bot responderá con un mensaje de bienvenida e instrucciones.

### Registro de Mensajes

Envía cualquier mensaje de texto al bot. El bot registrará el mensaje en un archivo Excel (`datos.xlsx`) y confirmará la acción.

### Comando /download

Envía el comando `/download` para descargar el archivo Excel que contiene los mensajes registrados.

## Código

El código del bot está estructurado de la siguiente manera:

```javascript
const { Telegraf } = require('telegraf');
const ExcelJS = require('exceljs');
const fs = require('fs');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

let workbook = new ExcelJS.Workbook();
let worksheet = workbook.addWorksheet('Datos');

worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Mensaje', key: 'mensaje', width: 30 },
];

// Manejar el comando /start
bot.start((ctx) => {
    ctx.reply('Bienvenido! Envía un mensaje para registrarlo en el archivo Excel. Usa /download para descargar el archivo Excel.');
});

// Manejar cualquier mensaje de texto
bot.on('text', (ctx) => {
    const message = ctx.message.text;

    // Registrar el mensaje en el archivo Excel
    const row = {
        id: ctx.from.id,
        nombre: ctx.from.first_name,
        mensaje: message,
    };

    worksheet.addRow(row);

    workbook.xlsx.writeFile('datos.xlsx')
        .then(() => {
            ctx.reply('Mensaje registrado en el archivo Excel.');
        })
        .catch((error) => {
            console.error('Error al guardar el archivo Excel:', error);
            ctx.reply('Hubo un error al registrar el mensaje.');
        });
});

// Manejar el comando /download
bot.command('download', (ctx) => {
    const filePath = 'datos.xlsx';

    workbook.xlsx.writeFile(filePath)
        .then(() => {
            ctx.replyWithDocument({ source: filePath })
                .then(() => {
                    console.log('Archivo enviado');
                })
                .catch((error) => {
                    console.error('Error al enviar el archivo:', error);
                    ctx.reply('Hubo un error al enviar el archivo.');
                });
        })
        .catch((error) => {
            console.error('Error al guardar el archivo Excel:', error);
            ctx.reply('Hubo un error al preparar el archivo para la descarga.');
        });
});

// Iniciar el bot
bot.launch()
    .then(() => {
        console.log('Bot iniciado');
    })
    .catch((error) => {
        console.error('Error al iniciar el bot:', error);
    });
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o envía un pull request para discutir cualquier cambio que desees realizar.

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).
```

### Notas Adicionales:

- URL: https://github.com/Misael-GC/bot_telegram_excel?tab=readme-ov-file
- Se agrega código para checar si ya existe un archivo excel lo elimine se fabrique otro con los nuevos datos
- Se crea una rama donde el archivo existente se agreguen las actualizaciones
- Te recomiendo ver el siguiente [link](https://www.notion.so/Bot-en-Telegram-para-descargar-mensajes-en-un-excel-3a7e11a2156f41d2a61a236cb744b86f)
