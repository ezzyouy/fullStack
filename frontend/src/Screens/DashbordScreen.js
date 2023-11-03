import React, { useEffect, useReducer } from 'react';
import { useContext } from 'react';
import Chart from 'react-google-charts';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return { ...state, summary: action.payload, loading: false };
		case 'FETCH_FAIL':
			return { ...state, error: action.payload, loading: false };
		default:
			return state;
	}
};
function DashbordScreen() {
	const [{ loading, summary, error }, dispatch] = useReducer(reducer, { loading: true, error: '' });
	const { state } = useContext(Store);
	const { userInfo } = state;
	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data } = await axios.get('/api/orders/summary', {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});

				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', loading: getError(err) });
			}
		};
		fetchData();
	}, [userInfo]);

	return (
		<div>
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<h1>Dashboard</h1>
			{loading ? (
				<LoadingBox></LoadingBox>
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<>
					<Row>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										{summary?.users && summary?.users[0] ? summary?.users[0].numUsers : 0}
									</Card.Title>
									<Card.Text>Users</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										{summary?.orders && summary?.users[0] ? summary?.orders[0].numOrders : 0}
									</Card.Title>
									<Card.Text>Orders</Card.Text>
								</Card.Body>
							</Card>
						</Col>
						<Col md={4}>
							<Card>
								<Card.Body>
									<Card.Title>
										$
										{summary?.orders && summary?.users[0]
											? summary?.orders[0].totalSales?.toFixed(2)
											: 0}
									</Card.Title>
									<Card.Text>Total</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					</Row>
					<div className="my-3">
						<h2>Sales</h2>
						{summary?.dailyOrders?.length === 0 ? (
							<MessageBox>No Sale</MessageBox>
						) : (
							<Chart
								width="100%"
								height="400px"
								loader={<div>Loading Chart...</div>}
								data={[['Date', 'Sales'], ...summary?.dailyOrders?.map((x) => [x._id, x.sales])]}
								chartType="AreaChart"
								legendToggle
							/>
						)}
					</div>
					<div className="my-3">
						<h2>Categories</h2>
						{summary?.productCategories?.length === 0 ? (
							<MessageBox>No Category</MessageBox>
						) : (
							<Chart
								width="100%"
								height="400px"
								loader={<div>Loading Chart...</div>}
								data={[
									['Category', 'Products'],
									...summary?.productCategories?.map((x) => [x._id, x.count]),
								]}
								chartType="PieChart"
								legendToggle
							/>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default DashbordScreen;
