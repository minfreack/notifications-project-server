const dotenv = require('dotenv')
const express =  require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io')
const routes = require('./routes');
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const { connectRabbitMQ } = require('./lib/rabbitmq');
dotenv.config()

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

async function rabbitMQ(io) {
  const channel = await connectRabbitMQ();
  channel.consume('notifications', async (message) => {
    try {
      const notification = JSON.parse(message.content.toString());
      if (notification.to === 'all') {
        io.emit('new_notification', notification);
      } else {
        io.to(notification.to).emit('new_notification', notification);
      }

      channel.ack(message);
    } catch (error) {
      console.error('Error processing message:', error);
      channel.reject(message, false);
    }
  });

  console.log('RabbitMQ consumer setup completed.');
}

const io = new Server(server);

io.on('connection', (socket) => {
  const id = socket.handshake.query['id'];
  socket.join(id);

  socket.on('disconnect', () => {
    socket.leave(id);
  });
});

rabbitMQ(io).catch((error) => {
  console.error('Error setting up RabbitMQ consumer:', error);
});

routes(app)

server.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});