import bcrypt from 'bcryptjs'
const data = {
  users: [
    {
      name: 'Bra',
      email: 'bra@gmail.com',
      password: bcrypt.hashSync('123456'),
      IsAdmin: true
    },
    {
      name: 'user',
      email: 'user@gmail.com',
      password: bcrypt.hashSync('123456'),
      IsAdmin: false
    }
  ],
  products: [
    {
      //_id: '1',
      name: 'Nike Slim Shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image: '/images/p1.jpg',
      price: 120,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      countInStock: 10
    },
    {
      //_id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Shirts',
      image: '/images/p2.jpg',
      price: 100,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      description: 'high quality product',
      countInStock: 2
    },
    {
      //_id: '3',
      name: 'Lacoste Free Shirt',
      slug: 'lacoste-free-shirt',
      category: 'Shirts',
      image: '/images/p3.jpg',
      price: 220,
      brand: 'Lacoste',
      rating: 4.8,
      numReviews: 17,
      description: 'high quality product',
      countInStock: 0
    },
    {
      //_id: '4',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image: '/images/p4.jpg',
      price: 78,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      description: 'high quality product',
      countInStock: 40
    },
    {
      //_id: '5',
      name: 'Puma Slim Pant',
      slug: 'puma-slim-pant',
      category: 'Pants',
      image: '/images/p5.jpg',
      price: 65,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality product',
      countInStock: 0
    },
    {
      //_id: '6',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Pants',
      image: '/images/p6.jpg',
      price: 139,
      brand: 'Adidas',
      rating: 4.5,
      numReviews: 15,
      description: 'high quality product',
      countInStock: 100
    }
  ]
}
export default data
