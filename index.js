const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const axios = require('axios');

// Ruta del archivo de video que deseas enviar
const videoPath = 'tola.mp4'; // Reemplaza 'ruta_del_video.mp4' con la ubicación de tu archivo de video

// Función para obtener la representación en base64 del archivo de video
function getBase64Data(filePath) {
  const data = fs.readFileSync(filePath);
  return data.toString('base64');
}

// Palabra clave que debe coincidir para enviar el video
const keyword = 'enviar video';

// Crea una instancia del cliente de WhatsApp con la configuración de puppeteer
const client = new Client({
  puppeteer: {
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  },
  authStrategy: new LocalAuth({ clientId: "client" })
});

// Evento para escanear el código QR y autenticar el cliente
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// Si la conexión es exitosa muestra el mensaje de conexión exitosa
client.on('ready', () => {
  console.log('Conexión exitosa nenes');
});

// Función para enviar el video local
function sendLocalVideo(chatId, videoPath) {
  if (fs.existsSync(videoPath)) {
    const media = MessageMedia.fromFilePath(videoPath);
    client.sendMessage(chatId, media)
      .then(() => {
        console.log('Video enviado con éxito!');
      })
      .catch((error) => {
        console.error('Error al enviar el video:', error);
      });
  } else {
    client.sendMessage(chatId, 'No se encontró el video.');
  }
}

// Función para manejar los mensajes entrantes
client.on('message', async (message) => {
  const lowercaseMessage = message.body.toLowerCase();

  // Verifica si el mensaje coincide con la palabra clave "hola"
  if (lowercaseMessage.includes('hola')) {
    const response = '¡Hola! ¿En qué puedo ayudarte?';
    client.sendMessage(message.from, response);
  }

  // Verifica si el mensaje coincide con la palabra clave "enviar video" y envía el video
  if (lowercaseMessage.includes(keyword)) {
    sendLocalVideo(message.from, videoPath);
  }
});

// Inicializar el cliente de WhatsApp
client.initialize();
