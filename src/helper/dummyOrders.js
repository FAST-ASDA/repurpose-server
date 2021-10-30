


const createRandomProduct = () => {
    const product = {
        'productId': Math.floor(Math.random() * 100 + 1),
        'quantity': Math.floor(Math.random() * 10 + 1)
    }
    return product
}

const createProducts = () => {
    const count = Math.floor(Math.random() * 5 + 1)
    let products = {};
    for (let i = 0; i < count; i++) {
        products[i] = createRandomProduct();
    }
    return products;
}


const createDummyOrder = () => {
    const order = []
    const status = ['delivered', 'out for delivery', 'preparing to dispatch', 'dispatched']
    order.push(JSON.stringify(createProducts()));
    order.push(Math.floor(Math.random() * 100 + 1))
    order.push(Math.floor(Math.random() * 100 + 1))
    order.push(status[Math.floor(Math.random() * 4)])
    order.push(Math.floor(Math.random() * 500))
    order.push(Math.floor(Math.random() * 50000))
    order.push(Math.floor(Math.random() * 2))
    return order

}

const dummyOrders = (count) => {
    let orders = []
    for (let i = 0; i < count; i++) {
        orders.push(createDummyOrder())
    }
    return orders
}
module.exports = {
    dummyOrders
}