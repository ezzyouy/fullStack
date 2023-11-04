import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Button from 'react-bootstrap/esm/Button';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				products: action.payload.products,
				page: action.payload.page,
				pages: action.payload.pages,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, error: action.payload, loading: false };
		case 'CREATE_REQUEST':
			return { ...state, createLoading: true };
		case 'CREATE_SUCCESS':
			return { ...state, createLoading: false };
		case 'CREATE_FAIL':
			return { ...state, createLoading: false };
		case 'DELETE_REQUEST':
			return { ...state, deleteLoading: true, successDelete: false };
		case 'DELETE_SUCCESS':
			return { ...state, deleteLoading: false, successDelete: true };
		case 'DELETE_FAIL':
			return { ...state, deleteLoading: false, successDelete: false };
		case 'DELETE_RESET':
			return { ...state, deleteLoading: false, successDelete: false };
		default:
			return state;
	}
};
function ProductListScreen() {
	const navigate = useNavigate();
	const { search, pathname } = useLocation();
	const sp = new URLSearchParams(search);
	const page = sp.get('page') || 1;
	const [{ loading, error, products, pages, createLoading, deleteLoading, successDelete }, dispatch] = useReducer(
		reducer,
		{
			loading: true,
			error: '',
		}
	);
	const { state } = useContext(Store);
	const { userInfo } = state;

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get(`/api/products/admin?page=${page}`, {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
			} catch (err) {
				dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
			}
		};

		if (successDelete) {
			dispatch({ type: 'DELETE_RESET' });
		} else {
			fetchData();
		}
	}, [dispatch, userInfo, page, successDelete]);
	const createHandler = async () => {
		if (window.confirm('Are you sure to create?')) {
			try {
				dispatch({ type: 'CREATE_REQUEST' });
				const { data } = await axios.post(
					`/api/products`,
					{},
					{
						headers: { Authorization: `Bearer ${userInfo.token}` },
					}
				);

				toast.success('product created successfully');
				dispatch({ type: 'CREATE_SUCCESS', payload: data });
				navigate(`/admin/product/${data.product._id}`);
			} catch (err) {
				dispatch({ type: 'CREATE_FAIL' });
				toast.error(getError(err));
			}
		}
	};
	const deleteHandler = async (product) => {
		if (window.confirm('Are you sure to delete?')) {
			try {
				dispatch({ type: 'DELETE_REQUEST' });
				await axios.delete(`/api/products/${product._id}`, {
					headers: { Authorization: `Bearer ${userInfo.token}` },
				});

				toast.success('product deleted successfully');
				dispatch({ type: 'DELETE_SUCCESS' });
			} catch (err) {
				dispatch({ type: 'DELETE_FAIL' });
				toast.error(getError(err));
			}
		}
	};
	return (
		<div>
			<Helmet>
				<title>Products</title>
			</Helmet>
			<Row>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className="col text-end">
					<div>
						<Button type="button" onClick={createHandler}>
							create Product
						</Button>
					</div>
				</Col>
			</Row>
			{createLoading && <LoadingBox></LoadingBox>}
			{deleteLoading && <LoadingBox></LoadingBox>}
			{loading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<>
					<table className="table">
						<thead>
							<tr>
								<th>ID</th>
								<th>NAME</th>
								<th>PRICE</th>
								<th>CATEGORY</th>
								<th>BRAND</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{console.log(products)}
							{products?.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>{product.category}</td>
									<td>{product.brand}</td>
									<td>
										<Button
											type="button"
											variant="light"
											onClick={() => navigate(`/admin/product/${product._id}`)}
										>
											Edit
										</Button>{' '}
										<Button type="button" variant="light" onClick={() => deleteHandler(product)}>
											Delete
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div>
						{[...Array(pages).keys()].map((x) => (
							<Link
								key={x + 1}
								to={{
									pathname: `/admin/products`,
									search: `page=${x + 1}`,
								}}
								className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
							>
								{x + 1}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	);
}

export default ProductListScreen;
