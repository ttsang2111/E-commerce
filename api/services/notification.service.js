'use strict';

const Noti = require('../models/notification.model')

const pushNotiToSystem = async ({
    type = "SHOP-001",
    senderId,
    receiverId,
    options = {}
}) => {
    let noti_content;

    if (type === "SHOP-001") {
        noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`
    } else if (type === "PROMOTION-001") {
        noti_content = `@@@ vừa mới thêm một voucher: @@@@@`
    }

    const newNoti = await Noti.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_content,
        noti_options: options
    })

    return newNoti;
}

module.exports = {
    pushNotiToSystem
}