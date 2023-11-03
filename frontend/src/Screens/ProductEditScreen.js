import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Container from 'react-bootstrap/Container';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'CREATE_REQUEST':
		default:
			return state;
	}
};

function ProductEditScreen() {
	const params = useParams();
	const { id: productId } = params;
	const { state } = useContext(Store);
	const { userInfo } = state;

	const [{ loading, error }, dispatch] = useReducer(reducer, {
		loading: true,
		error: '',
	});

	const [name, setName] = useState('');
	const [slug, setSlug] = useState('');
	const [price, setPrice] = useState('');
	const [image, setImage] = useState('');
	const [category, setCategory] = useState('');
	const [countInStock, setCountInStock] = useState('');
	const [brand, setBrand] = useState('');
	const [description, setDescription] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/products/id/${productId}`, {
					headers: { authorization: `Bearer ${userInfo.token}` },
				});
				setName(data.name);
				setSlug(data.slug);
				setPrice(data.price);
				setImage(data.image);
				setCategory(data.category);
				setCountInStock(data.countInStock);
				setBrand(data.brand);
				setDescription(data.description);
				dispatch({ type: 'FETCH_SUCCESS' });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, [productId]);

	return (
		<Container>
			<Helmet>
				<title>Edit Product</title>
			</Helmet>
			<h1>Edit Product ${productId}</h1>
			{loading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<Form>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label>Name</Form.Label>
						<Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="slug">
						<Form.Label>Slug</Form.Label>
						<Form.Control value={slug} onChange={(e) => setSlug(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="price">
						<Form.Label>Price</Form.Label>
						<Form.Control value={price} onChange={(e) => setPrice(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="image">
						<Form.Label>Image</Form.Label>
						<Form.Control value={image} onChange={(e) => setImage(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="category">
						<Form.Label>Category</Form.Label>
						<Form.Control value={category} onChange={(e) => setCategory(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="countInStock">
						<Form.Label>Count In Stock</Form.Label>
						<Form.Control value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="brand">
						<Form.Label>Brand</Form.Label>
						<Form.Control value={brand} onChange={(e) => setBrand(e.target.value)} required />
					</Form.Group>
					<Form.Group className="mb-3" controlId="description">
						<Form.Label>Description</Form.Label>
						<Form.Control value={description} onChange={(e) => setDescription(e.target.value)} required />
					</Form.Group>
					<Form.Group>
						<div className="mb-3">
							<Button type="submit">Update</Button>
						</div>
					</Form.Group>
				</Form>
			)}
		</Container>
	);
}

export default ProductEditScreen;