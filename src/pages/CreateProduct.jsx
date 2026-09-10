import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CreateProduct() {
const [productName, setProductName] = useState();
const [category, setCategory] = useState();
const [price, setPrice] = useState();
const [stock, setStock] = useState();
const [description, setDescription] = useState();
const [image, setImage] = useState();
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');



}
