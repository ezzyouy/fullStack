import React, { useContext, useEffect, useReducer } from 'react';
import { Store } from '../Store';
import { getError } from '../utils';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../Component/LoadingBox';
import MessageBox from '../Component/MessageBox';

const reducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_REQUEST':
			return { ...state, loading: true };
		case 'FETCH_SUCCESS':
			return {
				...state,
				users: action.payload,
				loading: false,
			};
		case 'FETCH_FAIL':
			return { ...state, error: action.payload, loading: false };

		default:
			return state;
	}
};
function UserListScreen() {
	const { state } = useContext(Store);
	const { userInfo } = state;

	const [{ loading, error, users }, dispatch] = useReducer(reducer, { loading: true, error: '' });

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch({ type: 'FETCH_REQUEST' });
				const { data } = await axios.get('/api/users', {
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
				<title>Users</title>
			</Helmet>
			<h1>Users</h1>
			{loading ? (
				<LoadingBox />
			) : error ? (
				<MessageBox variant="danger">{error}</MessageBox>
			) : (
				<table className="table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							{/*<th>IS SELLER</th>*/}
							<th>IS ADMIN</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{users?.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>{user.email}</td>
								{/* <td>{user._id}</td> */}
								<td>{user.IsAdmin ? 'YES' : 'NO'}</td>
								<td></td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default UserListScreen;
