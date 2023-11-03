import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import 'react-toastify/dist/ReactToastify.css';
import ProductScreen from './Screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import { Store } from './Store';
import { useContext, useEffect, useState } from 'react';
import CartScreen from './Screens/CartScreen';
import SigninScreen from './Screens/SigninScreen';
import ShippingAddressScreen from './Screens/ShippingAddressScreen';
import SignupScreen from './Screens/SignupScreen';
import PaymentScreen from './Screens/PaymentScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderScreen from './Screens/OrderScreen';
import OrderHistoryScrenn from './Screens/OrderHistoryScrenn';
import ProfileScreen from './Screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './Component/SearchBox';
import SearchScreen from './Screens/SearchScreen';
import ProtectedRoute from './Component/ProtectedRoute';
import DashbordScreen from './Screens/DashbordScreen';
import AdminRoute from './Component/AdminRoute';
import ProductListScreen from './Screens/ProductListScreen';
import ProductEditScreen from './Screens/ProductEditScreen';

function App() {
	const { state, dispatch: ctxDispatch } = useContext(Store);

	const { cart, userInfo } = state;

	const signoutHandler = () => {
		ctxDispatch({ type: 'USER_SIGNOUT' });
		localStorage.removeItem('userInfo');
		localStorage.removeItem('shippingAddress');
		localStorage.removeItem('paymentMethod');
		window.location.href = '/signin';
	};
	const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
	const [categories, setCategories] = useState([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await axios.get(`/api/products/categories`);
				setCategories(data);
			} catch (err) {
				toast.error(getError(err));
			}
		};
		fetchCategories();
	}, []);
	return (
		<BrowserRouter>
			<div
				className={
					sidebarIsOpen
						? 'd-flex flex-column site-container active-cont'
						: 'd-flex flex-column site-container'
				}
			>
				<ToastContainer position="bottom-center" limit={1} />
				<header>
					<Navbar bg="dark" variant="dark" expand="xl">
						<Container>
							<Button variant="dark" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
								<FontAwesomeIcon icon={faBars} />
							</Button>
							<LinkContainer to="/">
								<Navbar.Brand>Amazona</Navbar.Brand>
							</LinkContainer>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							<Navbar.Collapse id="basic-navbar-nav">
								<SearchBox />
								<Nav className="me-auto w-100 justify-content-end">
									<Link to="/cart" className="nav-link">
										Cart
										{cart.cartItems?.length > 0 && (
											<Badge pill bg="danger">
												{cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
											</Badge>
										)}
									</Link>
									{userInfo ? (
										<NavDropdown title={userInfo.name} id="basic-nav-dropdown">
											<LinkContainer to="/profile">
												<NavDropdown.Item>User Profile</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/orderhistory">
												<NavDropdown.Item>Order History</NavDropdown.Item>
											</LinkContainer>
											<NavDropdown.Divider />
											<Link className="dropdown-item" to="/signout" onClick={signoutHandler}>
												Sign out
											</Link>
										</NavDropdown>
									) : (
										<Link to="/signin" className="nav-link">
											Sign In
										</Link>
									)}
									{userInfo && userInfo.IsAdmin && (
										<NavDropdown title="Admin" id="admin-nav-dropdown">
											<LinkContainer to="/admin/dashbord">
												<NavDropdown.Item>Dashboard</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/products">
												<NavDropdown.Item>Products</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/orders">
												<NavDropdown.Item>Orders</NavDropdown.Item>
											</LinkContainer>
											<LinkContainer to="/admin/users">
												<NavDropdown.Item>Users</NavDropdown.Item>
											</LinkContainer>
										</NavDropdown>
									)}
								</Nav>
							</Navbar.Collapse>
						</Container>
					</Navbar>
				</header>
				<div
					className={
						sidebarIsOpen
							? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
							: 'side-navbar d-flex justify-content-between flex-wrap flex-column'
					}
				>
					<Nav className="flex-column text-white w-100 p-2">
						<Nav.Item>
							<strong>Categories</strong>
						</Nav.Item>
						{categories?.map((category) => (
							<Nav.Item key={category}>
								<LinkContainer
									to={{
										pathname: '/search',
										search: `?category=${category}`,
									}}
									onClick={() => setSidebarIsOpen(false)}
								>
									<Nav.Link>{category}</Nav.Link>
								</LinkContainer>
							</Nav.Item>
						))}
					</Nav>
				</div>
				<main>
					<Container className="mt-3">
						<Routes>
							<Route path="/product/:_id" element={<ProductScreen />} />
							<Route path="/cart" element={<CartScreen />} />
							<Route path="/signin" element={<SigninScreen />} />
							<Route path="/signup" element={<SignupScreen />} />
							<Route path="/shipping" element={<ShippingAddressScreen />} />
							<Route path="/payment" element={<PaymentScreen />} />
							<Route path="/placeorder" element={<PlaceOrderScreen />} />
							<Route
								path="/order/:id"
								element={
									<ProtectedRoute>
										<OrderScreen />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/orderhistory"
								element={
									<ProtectedRoute>
										<OrderHistoryScrenn />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<ProfileScreen />
									</ProtectedRoute>
								}
							/>
							<Route path="/search" element={<SearchScreen />} />
							{/*Admin*/}
							<Route
								path="/admin/dashbord"
								element={
									<AdminRoute>
										<DashbordScreen />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/products"
								element={
									<AdminRoute>
										<ProductListScreen />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/product/:id"
								element={
									<AdminRoute>
										<ProductEditScreen />
									</AdminRoute>
								}
							/>
							<Route path="/" element={<HomeScreen />} />
						</Routes>
					</Container>
				</main>
				<footer>
					<div className="text-center">All rights reserved</div>
				</footer>
			</div>
		</BrowserRouter>
	);
}

export default App;
