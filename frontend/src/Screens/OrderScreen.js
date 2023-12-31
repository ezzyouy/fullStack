import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, order: action.payload };
		case 'FETCH_FAIL':
			return { ...state, loading: false, error: action.payload };
		case 'PAY_REQUEST':
			return { ...state, loadingPay: true };
		case 'PAY_SUCCESS':
			return { ...state, loadingPay: false, successPay: true };
		case 'PAY_FAIL':
			return { ...state, loadingPay: false };
		case 'PAY_REST':
			return { ...state, loadingPay: false, successPay: false };
		case 'DELIVER_REQUEST':
			return { ...state, loadingDeliver: true };
		case 'DELIVER_SUCCESS':
			return { ...state, loadingDeliver: false, successDeliver: true };
		case 'DELIVER_FAIL':
			return { ...state, loadingDeliver: false };
		case 'DELIVER_REST':
			return { ...state, loadingDeliver: false, successDeliver: false };
		default:
			return state;
	}
};
function OrderScreen() {
	const params = useParams();
	const { id: orderId } = params;
	const navigate = useNavigate();
	const { state, dispatch: ctxDispatch } = useContext(Store);
	const { userInfo } = state;
	const [{ loading, error, order, successPay, loadingPay, loadingDeliver, successDeliver }, dispatch] = useReducer(
		reducer,
		{
			loading: true,
			error: '',
			order: {},
			successPay: false,
			loadingPay: false,
		}
	);
	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
	function createOrder(data, actions) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: { value: order.totalPrice },
					},
				],
			})
			.then((orderID) => {
				return orderID;
			});
	}
	function onApprove(data, actions) {
		return actions.order.capture().then(async function (details) {
			try {
				dispatch({ type: 'PAY_REQUEST' });
				const { data } = await axios.put(`/api/orders/${order._id}/pay`, details, {
					headers: { authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'PAY_SUCCESS', payload: data });
				toast.success('Order is paid');
			} catch (error) {
				dispatch({ type: 'PAY_FAIL', payload: getError(error) });
				toast.error(getError(error));
			}
		});
	}
	function onError(err) {
		toast.error(getError(err));
	}
	useEffect(() => {
		const fetchOrder = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/orders/${orderId}`, {
					headers: { authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (error) {
				dispatch({ type: 'FTECH_FAIL', payload: getError(error) });
			}
		};
		if (!userInfo) {
			navigate('/signin');
		}
		if (!order._id || successPay || (order._id && order._id !== orderId) || successDeliver) {
			fetchOrder();
			if (successPay) {
				dispatch({ type: 'PAY_REST' });
			}
			if (successDeliver) {
				dispatch({ type: 'DELIVER_REST' });
			}
		} else {
			const loadPaypalScript = async () => {
				const { data: clientId } = await axios.get('/api/keys/paypal', {
					headers: { authorization: `Bearer ${userInfo.token}` },
				});
				paypalDispatch({
					type: 'resetOptions',
					value: {
						clientId: clientId,
						currency: 'USD',
					},
				});
				paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
			};
			loadPaypalScript();
		}
	}, [userInfo, navigate, order, orderId, paypalDispatch, successDeliver, successPay]);

	const deliverOrderHandler = async () => {
		try {
			dispatch({ type: 'DELIVER_REQUEST' });
			const { data } = await axios.put(
				`/api/orders/${order._id}/deliver`,
				{},
				{
					headers: { authorization: `Bearer ${userInfo.token}` },
				}
			);

			dispatch({ type: 'DELIVER_SUCCESS', payload: data });
			toast.success('Order Delivered Successfully!');
		} catch (err) {
			toast.error(getError(err));
			dispatch({ type: 'DELIVER_FAIL' });
		}
	};

	return loading ? (
		<LoadingBox></LoadingBox>
	) : error ? (
		<MessageBox variant="danger">{error}</MessageBox>
	) : (
		<div>
			<Helmet>
				<title>Order {orderId}</title>
			</Helmet>
			<h1 className="my-3">Order {orderId}</h1>
			<Row>
				<Col md={8}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Shipping</Card.Title>
							<Card.Text>
								<strong>Name:</strong>
								{order.shippingAddress.fullName}
								<br />
								<strong>Address:</strong>
								{order.shippingAddress.address}, {order.shippingAddress.city},{' '}
								{order.shippingAddress.postalCode}, {order.shippingAddress.country}
							</Card.Text>
							{order.isDelivered ? (
								<MessageBox variant="success">Delivered at {order.delivered}</MessageBox>
							) : (
								<MessageBox variant="danger">Not Delivered</MessageBox>
							)}
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Payment</Card.Title>
							<Card.Text>
								<strong>Method:</strong>
								{order.paymentMethod}
							</Card.Text>
							{order.isPaid ? (
								<MessageBox variant="success">Paid at {order.paidAt}</MessageBox>
							) : (
								<MessageBox variant="danger">Not Paid</MessageBox>
							)}
						</Card.Body>
					</Card>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Items</Card.Title>
							<ListGroup variant="flush">
								{order.orderItems?.map((item) => (
									<ListGroup.Item key={item._id}>
										<Row className="align-items-center">
											<Col md={6}>
												<img
													src={item.image}
													alt={item.name}
													className="img-fluid rounded img-thumbnail"
												/>
												<Link to={`/product/${item._id}`}>{item.name}</Link>
											</Col>
											<Col md={3}>
												<span>{item.quantity}</span>
											</Col>
											<Col md={3}>${item.price}</Col>
										</Row>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
				<Col md={4}>
					<Card className="mb-3">
						<Card.Body>
							<Card.Title>Order Sunnary</Card.Title>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col md={6}>Items</Col>
										<Col>${order.itemsPrice?.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col md={6}>Shipping</Col>
										<Col>${order.shippingPrice?.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col md={6}>Tax</Col>
										<Col>${order.taxPrice?.toFixed(2)}</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col md={6}>
											<strong>Shipping </strong>
										</Col>
										<Col>
											<strong>${order.totalPrice?.toFixed(2)}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								{!order.isPaid && (
									<ListGroup.Item>
										{isPending ? (
											<LoadingBox />
										) : (
											<div>
												<PayPalButtons
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}
												></PayPalButtons>
											</div>
										)}
										{loadingPay && <LoadingBox></LoadingBox>}
									</ListGroup.Item>
								)}
								{userInfo.IsAdmin && order.isPaid && !order.isDelivered && (
									<ListGroup.Item>
										{loadingDeliver && <LoadingBox />}
										<div className="d-grid">
											<Button type="button" onClick={deliverOrderHandler}>
												Deliver Order
											</Button>
										</div>
									</ListGroup.Item>
								)}
							</ListGroup>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default OrderScreen;
