const uuid = require('uuid');
const faker = require('faker');

module.exports = async function generateRandomMessage() {
  const delay = Math.floor(Math.random() * (13000 - 3000) + 3000);
  return new Promise((resolve, reject) => {
    const message = {
      id: uuid.v4(),
      from: faker.internet.email(),
      subject: `Hello from ${faker.name.findName()}`,
      body: faker.random.words(Math.floor(Math.random() * (300 - 50) + 50)),
      received: Date.now(),
    }
    setTimeout(() => resolve(message), delay);
  });
}