import express, { query } from 'express';
import Product from '../models/ProductModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../utils.js';

const productRouter = express.Router();
const PAGE_SIZE = 3;
productRouter.get('/', async (req, res) => {
	const products = await Product.find();
	res.send(products);
});
productRouter.post(
	'/',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const nweProduct = new Product({
			name: req.body.name || 'sample name ' + Date.now(),
			slug: req.body.slug || 'sample-name-' + Date.now(),
			price: req.body.price || 0,
			description: req.body.description || 'sample description',
			category: req.body.category || 'sample category',
			brand: req.body.brand || 'sample brand',
			image: req.body.image || '/images/p1.jpg',
			countInStock: req.body.countInStock || 0,
			rating: req.body.rating || 0,
			numReviews: req.body.numReviews || 0,
		});
		const product = await nweProduct.save();
		res.send({ message: 'Product Created', product });
	})
);
productRouter.get(
	'/admin',
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;
		const products = await Product.find()
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		const countProducts = await Product.countDocuments();
		res.send({ products, countProducts, page, pages: Math.ceil(countProducts / pageSize) });
	})
);
productRouter.get(
	'/search',
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const pageSize = query.pageSize || PAGE_SIZE;
		const page = query.page || 1;
		const category = query.category || '';
		const brand = query.brand || '';
		const price = query.price || '';
		const rating = query.rating || '';
		const order = query.order || 1;
		const searchQuery = query.query || '';
		const queryFilter =
			searchQuery && searchQuery !== 'all'
				? {
						name: {
							$regex: searchQuery,
							$options: 'i',
						},
				  }
				: {};
		const categoryFilter = category && category !== 'all' ? { category } : {};
		const ratingFilter =
			rating && rating !== 'all'
				? {
						rating: {
							$gte: Number(rating),
						},
				  }
				: {};
		const priceFilter =
			price && price !== 'all'
				? {
						price: {
							$gte: Number(price.split('-')[0]),
							$lte: Number(price.split('-')[0]),
						},
				  }
				: {};
		const sortOrder =
			order === 'featured'
				? { featured: -1 }
				: order === 'lowest'
				? { price: 1 }
				: order === 'highest'
				? { price: -1 }
				: order === 'toprated'
				? { rating: -1 }
				: order === 'newest'
				? { createdAt: -1 }
				: { _id: -1 };
		const products = await Product.find({
			...queryFilter,
			...categoryFilter,
			...ratingFilter,
			...priceFilter,
		})
			.sort(sortOrder)
			.skip(pageSize * (page - 1))
			.limit(pageSize);
		const countProducts = await Product.countDocuments({
			...queryFilter,
			...categoryFilter,
			...ratingFilter,
			...priceFilter,
		});
		res.send({ products, countProducts, page, pages: Math.ceil(countProducts / pageSize) });
	})
);
productRouter.get('/id/:id', async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) res.send(product);
	else res.status(404).send({ message: 'Product not found' });
});

productRouter.get(
	'/categories',
	expressAsyncHandler(async (req, res) => {
		const categories = await Product.find().distinct('category');
		res.send(categories);
	})
);

export default productRouter;
