class SSEService {
  constructor() {
    this.clients = new Map();
  }

  addClient(featureName, res) {
    if (!this.clients.has(featureName)) {
      this.clients.set(featureName, new Set());
    }
    this.clients.get(featureName).add(res);

    req.on('close', () => {
      this.removeClient(featureName, res);
    });
  }

  removeClient(featureName, res) {
    if (this.clients.has(featureName)) {
      this.clients.get(featureName).delete(res);
    }
  }

  broadcast(featureName, event, data) {
    if (!this.clients.has(featureName)) return;
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients.get(featureName)) {
      client.write(payload);
    }
  }

  getClientCount(featureName) {
    return this.clients.has(featureName)
      ? this.clients.get(featureName).size
      : 0;
  }
}

module.exports = new SSEService();