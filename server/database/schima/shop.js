const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Shop = new mongoose.Schema({
    shopImage: {
        type: String
    },
    shopName: {
        type: String
    },
    shopType: {
        type: String
    },
    shopAddress: {
        type: String
    },
    followers: [{
        followerName: {
            type: String
        },
        followerID: {
            type: String
        }
    }],
    followings: [{
        followingName: {
            type: String
        },
        followingID: {
            type: String
        }
    }],
    shopProductListId: {
        type: String
    },
    shopImageListId: {
        type: String
    }
})

const Shop_Schima = mongoose.model("shops", Shop);
module.exports = Shop_Schima;
