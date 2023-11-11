import './ShopPage.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import i from '../../assets/accont.png'
import Card from '../../components/card/Card'

export default function ShopPage({ addToCart, setBuyProductData }) {
	const params = useParams();

	useEffect(() => {
		getShopData();
	}, [])

	const [shopData, setShopData] = useState();

	const getShopData = async () => {
		const result = await axios.get(`http://localhost:5000/getShopData/${params.shopID}`);
		setShopData(result.data);
	}

	console.log(shopData);
	return (
		<div className='ShopPage'>
			{
				shopData
					?
					<div className='accontDetailsTop flex'>
						<div className='imageArea flex'>
							<img src={shopData.shopImage} />
						</div>
						<div className='textArea flex2'>
							<h1>{shopData.shopName} <span>({shopData.shopType})</span></h1>
							<h4>{shopData.shopAddress}</h4>
							<div className='followingArea flex2'>
								<div>
									<h4>Products</h4>
									<h4>2300</h4>
								</div>
								<div>
									<h4>Follower</h4>
									<h4>{shopData.followers.length}</h4>
								</div>
								<div>
									<h4>Following</h4>
									<h4>{shopData.followings.length}</h4>
								</div>
							</div>
						</div>
					</div>
					:
					<></>
			}

			<div className='accontDetailsBottom'>
				<div className='topBar'>
					<ul>
						<li>Products</li>
						<li>Photos</li>
					</ul>
				</div>
				<div className='topBar topBar1 flex'>
					{
						shopData
							?
							<>
								<Link className='btn topBarBtn' to="/">Shopping</Link>
								<Link className='btn topBarBtn' to="/">Shopping Following Shop</Link>
							</>
							:
							<></>
					}
				</div>
				<div className='shopBody'>
					{/* <div className='boxArea'>
						{
							resultData
								?
								<>
									<div className='boxAreaTop'>
										<h1>{allCatagory[1]}</h1>
										<Link className='link' to={`/secondPage/${allCatagory[1]}`}>See All</Link>
									</div>
									<div className='boxAreaBottom'>
										{
											resultData.map((e) => {
												if (e.catagory === allCatagory[1]) {
													return (
														<Card cardData={e} addToCart={addToCart} setBuyProductData={setBuyProductData} />
													);
												}
											})
										}
									</div>
								</>
								:
								<></>
						}
					</div> */}
				</div>
			</div>
		</div>
	)
}
