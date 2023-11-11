const express = require("express");
const cors = require("cors");
const dotdev = require('dotenv');
const bcrypt = require('bcryptjs');
const fileupload = require("express-fileupload");
const User_Schima = require("./database/schima/user");
const Shop_Schima = require("./database/schima/shop");
const Product_Schima = require("./database/schima/product");
const Company_Schima = require("./database/schima/company");
const ShopProductList_Schima = require("./database/schima/shopProductList");

dotdev.config({ path: './config.env' });
require("./database/connection");
const app = express();

app.use(fileupload());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());




//getToken API ================================= getToken API
app.post("/getToken", async (req, res) => {
	try {
		const { token } = req.body;
		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			res.json({ "message": true });
		}
	}
	catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
});



//REGISTRATION API ================================= REGISTRATION API
app.post('/register', async (req, res) => {
	try {
		const { userImage, userName, userEmail, userPassword } = req.body;
		const userExist = await User_Schima.findOne({ userEmail: userEmail });
		if (userExist) {
			return res.status(422).json({ error: "User already exist" });
		} else {
			const user = new User_Schima({ userImage, userName, userEmail, userPassword });
			await user.save();
			return res.status(201).json({ message: "User register successful" });
		}
	} catch (err) {
		console.log(err);
	}
	return res.send(req.body);

});


//LOGIN API ================================= LOGIN API
app.post("/login", async (req, res) => {
	try {
		const { userEmail, userPassword } = req.body;

		const userLogin = await User_Schima.findOne({ userEmail: userEmail });

		if (userLogin) {
			const isPasordMatch = await bcrypt.compare(userPassword, userLogin.userPassword);

			if (isPasordMatch) {
				let auth_token = await userLogin.generateAuthToken();
				res.json({ "auth_token": auth_token, "id": userLogin._id });
			} else {
				res.status(400).json({ error: "Invalid Cradential" });
			}
		} else {
			res.status(400).json({ error: "Invalid Cradential" });
		}
	} catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
})


//ShopCreate API ================================= ShopCreate API
app.post('/shopCreate', async (req, res) => {
	try {
		const { token, shopImage, shopName, shopType, shopAddress } = req.body;

		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			const shop = new Shop_Schima({ shopImage, shopName, shopType, shopAddress });
			const data = await shop.save();
			isUsrToken.shopID = isUsrToken.shopID = data._id.toString();
			await isUsrToken.save();
		}
		return res.status(201).json({ message: "Shop creation successful" });

	} catch (err) {
		console.log(err);
	}
	return res.send(req.body);

});


//getUserImage API ================================= getUserImage API
app.post("/getUserImage", async (req, res) => {
	try {
		const { token } = req.body;
		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			res.json({ "userImg": isUsrToken.userImage });
		}
	}
	catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
});

//getShopID API ================================= getShopID API
app.post("/getShopID", async (req, res) => {
	try {
		const { token } = req.body;
		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			res.send(isUsrToken.shopID);
		}
	}
	catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
});



//ADD DATA ================================= ADD DATA
app.post('/addData', async (req, res) => {
	try {
		const { productName, productImage, companyName, companyImage, catagory, description, rating } = req.body;
		const isCompanyName = await Company_Schima.findOne({ companyName: companyName });
		if (isCompanyName) {
			const ProductCollections = new Product_Schima({ productName, productImage, companyName, catagory, description, rating });
			const data = await ProductCollections.save();
			isCompanyName.productIds = isCompanyName.productIds.concat({ productId: data._id.toString() });
			await isCompanyName.save();
		} else {
			const ProductCollections = new Product_Schima({ productName, productImage, companyName, catagory, description, rating });
			const data = await ProductCollections.save();
			let productIds = [
				{
					productId: data._id.toString()
				}
			]
			const ProductCompanyCollection = new Company_Schima({ companyName, companyImage, productIds });
			await ProductCompanyCollection.save();
		}
		return res.status(201).json({ error: "Uploaded" });;
	} catch (err) {
		console.log(err)
	}
	return res.send(req.body);
});


//getProducts ================================= getProducts
app.get('/getProducts', async (req, res) => {
	let result = await Product_Schima.find();

	if (result.length > 0) {
		res.send(result);
	} else {
		res.send({ reslt: "No product found" });
	}
});


//getCompany ================================= getCompany
app.get('/getCompany', async (req, res) => {
	let result = await Company_Schima.find();
	if (result.length > 0) {
		res.send(result);
	} else {
		res.send({ reslt: "No product found" });
	}
});



//buySingleProducts ================================= buySingleProducts
app.post('/buySingleProducts', async (req, res) => {
	const { token, productId, quantity, productPrice, sellType, offer, deliveryCharge } = req.body;
	try {
		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			const isShopId = await Shop_Schima.findOne({ _id: isUsrToken.shopID });
			if (isShopId) {
				const isShopProductListId = await ShopProductList_Schima.findOne({ _id: isShopId.shopProductListId });
				if (isShopProductListId) {
					let productList = [
						{
							productId: productId,
							quantity: quantity,
							productPrice: productPrice,
							sellType: sellType,
							offer: offer,
							deliveryCharge: deliveryCharge
						}
					];
					isShopProductListId.productList = isShopProductListId.productList.concat(productList);
					await isShopProductListId.save();
				} else {
					let productList = [
						{
							productId: productId,
							quantity: quantity,
							productPrice: productPrice,
							sellType: sellType,
							offer: offer,
							deliveryCharge: deliveryCharge
						}
					];
					const shopProductList = new ShopProductList_Schima({ productList });
					const data = await shopProductList.save();

					isShopId.shopProductListId = data._id.toString();
					await isShopId.save();
				}
			}
		}
	}
	catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
});






//buyChartProdcts ================================= buyChartProdcts
app.post('/buyChartProdcts', async (req, res) => {
	const { token, buyChartProdctsData } = req.body;
	
	try {
		const isUsrToken = await User_Schima.findOne({ "tokens.token": token });
		if (isUsrToken) {
			const isShopId = await Shop_Schima.findOne({ _id: isUsrToken.shopID });
			if (isShopId) {
				const isShopProductListId = await ShopProductList_Schima.findOne({ _id: isShopId.shopProductListId });
				if (isShopProductListId) {
					isShopProductListId.productList = isShopProductListId.productList.concat(buyChartProdctsData);
					await isShopProductListId.save();
				} else {
					const shopProductList = new ShopProductList_Schima({productList : buyChartProdctsData});
					const data = await shopProductList.save();

					isShopId.shopProductListId = data._id.toString();
					await isShopId.save();
				}
			}
		}
	}
	catch (err) {
		console.log(err);
	}
	return res.send(req.body.data);
});

















app.get("/getShopData/:shopID", async (req, res) => {
	let result = await Shop_Schima.find({ _id: req.params.shopID });
	res.send(result[0]);
});

app.get("/SPCodeData/:catagory", async (req, res) => {
	let result = await Product_Schima.find({ catagory: req.params.catagory });
	res.send(result);
});


app.get("/CPData/:companyName", async (req, res) => {
	let result = await Product_Schima.find({ companyName: req.params.companyName });
	res.send(result);
});


//SEARCH ================================= SEARCH
app.get('/search/:key', async (req, res) => {
	let result = await Product_Schima.find({
		"$or": [
			{ productName: { $regex: req.params.key } }
		]
	});
	res.send(result);
});




const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log("Server Start");
});
