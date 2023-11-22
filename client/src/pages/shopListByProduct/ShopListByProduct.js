import './ShopListByProduct.css';
import React, { useEffect, useState } from 'react'
import FromData from 'form-data';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ShopListByProduct({ addToCart, shopListProductData }) {
	const params = useParams();

	const [shopListByProductData, setShopListByProductData] = useState();

	useEffect(() => {
		getShopListByProducts();
	}, [])
console.log(shopListByProductData);
	const getShopListByProducts = async () => {
		let fromData = new FromData();
		fromData.append("productId", shopListProductData._id);
		const result = await axios.post("http://localhost:5000/getShopListByProduct", fromData,);
		setShopListByProductData(result.data)
	}

	return (
		<div className='ShopListByProduct'>

			{
				shopListByProductData ?
					shopListByProductData.map((sp) => {
						return (
							<div className='ShopListByProductDataArea'>
								<img src={shopListProductData.productImage} />
								<h1>{shopListProductData.productName}</h1>
								<h1>{shopListByProductData.shopname}</h1>
								<div className='priceDetails'>
									<span>Original Price</span>
									<span>Offer</span>
									<span>After Offer</span>
									<span>Delevery Charge</span>
									<span>After Delevery Charge</span>
									<p>Under Line</p>
									<h1>Total Price <span>200</span></h1>
								</div>
								<div className='bttonArea'>
									<button className='addToChartBtn'>addToChartBtn</button>
									<button className='ShopBtn'>ShopBtn</button>
								</div>
							</div>
						);
					})
					:
					<></>
			}

		</div>

	)
}

