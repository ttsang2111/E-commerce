const redisPubsubService = require('../services/redis.Pubsub.service');

class InventoryServiceTest {

    async subscribe() {
        await redisPubsubService.subscribe('purchase_events', (message) => {
            InventoryServiceTest.updateInventory(JSON.parse(message));
        })
    }

    static updateInventory({productId, quantity}) {
        console.log(`Updated inventory ${productId} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();