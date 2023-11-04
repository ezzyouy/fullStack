import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				orders: action.payload,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, error: action.payload, loading: false };

		default:
			return state;
	}
};
function OrderListScreen() {
	const navigate = useNavigate();
	const { state } = useContext(Store);
	const { userInfo } = state;

	const [{ loading, error, orders }, dispatch] = useReducer(reducer, { loading: true, error: '' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/orders', {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});

				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};
		fetchData();
	}, [userInfo]);

	return (
		<div>
			<Helmet>
				<title>Orders</title>
			</Helmet>
			<h1>Orders</h1>
			{loading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>USER</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{orders?.map((o) => (
							<tr key={orders._id}>
								<td>{o._id}</td>
								<td>{o.user ? o.user.name : 'DELETED USER'}</td>
								<td>{o.createdAt?.substring(0, 10)}</td>
								<td>${o.totalPrice?.toFixed(2)}</td>
								<td>{o.isPaid ? o.paidAt?.substring(0, 10) : 'No'}</td>
								<td>{o.deliveredAt?.substring(0, 10)}</td>
								<td>
									<Button
										type="button"
										variant="light"
										onClick={() => {
											navigate(`/order/${o._id}`);
										}}
									>
										Details
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default OrderListScreen;
