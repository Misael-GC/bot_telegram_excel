const { Telegraf } = require('telegraf');
const ExcelJS = require('exceljs');
const fs = require('fs');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const filePath = 'datos.xlsx';

// Verificar si el archivo existe y eliminarlo
if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
}

// Crear un nuevo libro de Excel
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

    workbook.xlsx.writeFile(filePath)
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
