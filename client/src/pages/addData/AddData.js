import React, { useState } from 'react'
import FromData from 'form-data';
import axios from 'axios';
import './AddData.css'
import downloadImg from '../../assets/downloadImg.png'


export default function AddData() {

    const allCatagory = ["cookies", "cake", "brade", "milkShake", "hotdog"];
    
    const [productName, setProductName] = useState("");
    const [productImage, setProductImage] = useState();
    const [companyName, setCompanyName] = useState("");
    const [companyImage, setCompanyImage] = useState();
    const [catagory, setCatagory] = useState(allCatagory[0]);
    const [description, setDescription] = useState();
    const [rating, setRating] = useState();

    const convertProductIMG = (e) => {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setProductImage(fileReader.result);
        }
    }

    const convertCompanyIMG = (e) => {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);
        fileReader.onload = () => {
            setCompanyImage(fileReader.result);
        }
    }

    const handleSubmit = async () => {
        let fromData = new FromData();

        fromData.append("productName", productName);
        fromData.append("productImage", productImage);
        fromData.append("companyName", companyName);
        fromData.append("companyImage", companyImage);
        fromData.append("catagory", catagory);
        fromData.append("description", description);
        fromData.append("rating", rating);
        
        const result = await axios.post("http://localhost:5000/addData", fromData,);
        if(result.status === 201) {
            alert("Product uploaded");
        }
    }

    return (
        <div className='addData flex'>
            <div className='leftSide'>
                <div class="input_box">
                    <input className='input_box' type='text' name='name' required onChange={(e) => setProductName(e.target.value)}></input>
                    <span>Product Name</span>
                    <i></i>
                </div>
                <div class="input_box">
                    <input className='input_box' type='text' name='companyName' required onChange={(e) => setCompanyName(e.target.value)}></input>
                    <span>Company Name</span>
                    <i></i>
                </div>
                <div class="input_box">
                    <input className='input_box' type='text' name='description' required onChange={(e) => setDescription(e.target.value)}></input>
                    <span>Product Description</span>
                    <i></i>
                </div>
                <div class="input_box">
                    <input className='input_box' type='text' name='rating' required onChange={(e) => setRating(e.target.value)}></input>
                    <span>Rating</span>
                    <i></i>
                </div>
                <div class="select_box">
                    <select onChange={(c) => setCatagory(c.target.value)}>
                        {
                            allCatagory.map((c) => {
                                return (
                                    <option value={c}>{c}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <button className='btn' type='submit' onClick={handleSubmit}>Submit</button>
            </div>
            <div className='rightSide'>
                <div className='input_img_box flex'>
                    <img src={productImage == "" || productImage == null ? downloadImg : productImage}></img>
                    <input className='image_input' accept='image/*' name='image' type='file' onChange={convertProductIMG}></input>
                </div>
                <div className='input_img_box flex'>
                    <img src={companyImage == "" || companyImage == null ? downloadImg : companyImage}></img>
                    <input className='image_input' accept='image/*' name='image' type='file' onChange={convertCompanyIMG}></input>
                </div>
            </div>
        </div>
    )
}