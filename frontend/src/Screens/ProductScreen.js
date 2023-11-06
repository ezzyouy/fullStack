import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logger from 'use-reducer-logger';
import Rating from '../Component/Rating';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
	switch (action.type) {
		case 'REFRESH_PRODUCT':
			return { ...state, product: action.payload };
		case 'CREATE_REQUEST':
			return { ...state, loadingCreateReview: true };
		case 'CREATE_SUCCESS':
			return { ...state, loadingCreateReview: false };
		case 'CREATE_FAIL':
			return { ...state, loadingCreateReview: false };
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, product: action.payload };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
};

function ProductScreen() {
	const reviewsRef = useRef();
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState('');
	const navigate = useNavigate();
	const params = useParams();
	const { _id } = params;
	const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(logger(reducer), {
		product: [],
		loading: true,
		error: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_REQUEST' });
			try {
				const result = await axios.get(`/api/products/id/${_id}`);
				dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
			} catch (error) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
			}
		};
		fetchData();
	}, [_id]);
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { cart, userInfo } = state;
	const addToCartHandler = async () => {
		const existItem = cart.cartItems.find((x) => x._id === product._id);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/id/${product._id}`);
		if (data.countInStock < quantity) {
			window.alert('Sorry, Product is out of stock');
			return;
		}
		ctxDispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
		navigate('/cart');
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		if (!comment || !rating) {
			toast.error('Please enter comment and rating');
			return;
		}
		try {
			dispatch({ type: 'CREATE_REQUEST' });
			const { data } = await axios.post(
				`/api/products/${product._id}/reviews`,
				{ rating, comment, name: userInfo.name },
				{
					headers: {
						Authorization: `Bearer ${userInfo?.token}`,
					},
				}
			);
			dispatch({ type: 'CREATE_SUCCESS' });
			toast.success('Review submitted successfully');
			product.reviews.unshift(data.review);
			product.numReviews = data.numReviews;
			dispatch({ type: 'REFRESH_PRODUCT', payload: product });

			window.scrollTo({
				behavior: 'smooth',
				top: reviewsRef.current.offsetTop,
			});
		} catch (err) {
			toast.error(getError(err));
			dispatch({ type: 'CREATE_FAIL' });
		}
	};
	return loading ? (
		<LoadingBox />
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<div>
			<Row>
				<Col md={6}>
					<img className="img-large" src={product.image} alt={product.name} />
				</Col>
				<Col md={3}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<Helmet>
								<title>{product.name}</title>
							</Helmet>
							<h1>{product.name}</h1>
						</ListGroup.Item>
						<ListGroup.Item>
							<Rating rating={product.rating} numReviews={product.numReviews} />
						</ListGroup.Item>
						<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
						<ListGroup.Item>
							Description: <p>{product.description}</p>
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={3}>
					<Card>
						<Card.Body>
							<ListGroup>
								<ListGroup.Item>
									<Row>
										<Col>Price :</Col>
										<Col>${product.price}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status :</Col>
										<Col>
											{product.countInStock > 0 ? (
												<Badge bg="success">In Stock</Badge>
											) : (
												<Badge bg="danger">Unavailable</Badge>
											)}
										</Col>
									</Row>
								</ListGroup.Item>
								{product.countInStock > 0 && (
									<ListGroup.Item>
										<div className="d-grid">
											<Button onClick={addToCartHandler} variant="primary">
												Add to Cart
											</Button>
										</div>
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<div className="my-3">
				<h2 ref={reviewsRef}>Reviews</h2>
				<div className="mb-3">
					{product.reviews?.length === 0 && <MessageBox>There is no review</MessageBox>}
				</div>
				<ListGroup>
					{console.log(product.reviews)}
					{product?.reviews?.map((review) => (
						<ListGroup.Item key={review._id}>
							<strong>{review.name}</strong>
							<Rating rating={review.rating} caption="" />
							<p>{review.createdAt?.substring(0, 10)}</p>
							<p>{review.comment}</p>
						</ListGroup.Item>
					))}
				</ListGroup>
				<div className="my-3">
					{userInfo ? (
						<form onSubmit={submitHandler}>
							<h2>Write a customer review</h2>
							<Form.Group className="mb-3" controlId="rating">
								<Form.Label>Rating</Form.Label>
								<Form.Select
									aria-label="Rating"
									value={rating}
									onChange={(e) => setRating(Number(e.target.value))}
								>
									<option value="">Select...</option>
									<option value="1">1 - Poor</option>
									<option value="2">2 - Fair</option>
									<option value="3">3 - Good</option>
									<option value="4">4 - Very good</option>
									<option value="5">5 - Excellent</option>
								</Form.Select>
							</Form.Group>
							<FloatingLabel controlId="floatingTextarea" label="Comments" className="mb-3">
								<Form.Control
									as="textarea"
									placeholder="Leave a comment here"
									value={comment}
									onChange={(e) => {
										setComment(e.target.value);
									}}
								/>
							</FloatingLabel>
							<div className="mb-3">
								<Button type="submit" disabled={loadingCreateReview}>
									Submit
								</Button>
								{loadingCreateReview && <LoadingBox />}
							</div>
						</form>
					) : (
						<MessageBox>
							Please <Link to={`/signin?redirect=/product/${product._id}`}>Sign In</Link> to write a
							review
						</MessageBox>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProductScreen;
