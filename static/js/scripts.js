console.log('Scripts.js loaded');

let token = localStorage.getItem('token');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function checkAuth() {
    console.log('Checking auth status');
    const authLinks = document.getElementById('auth-links');
    const profileLink = document.getElementById('profile-link');
    const logoutBtn = document.getElementById('logout-btn');
    if (token) {
        authLinks.classList.add('hidden');
        profileLink.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = '/login/';
        });
    } else {
        authLinks.classList.remove('hidden');
        profileLink.classList.add('hidden');
        logoutBtn.classList.add('hidden');
    }
}

async function registerUser(event) {
    event.preventDefault();
    console.log('Register form submitted');
    const form = event.target;
    const data = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    };
    try {
        const response = await fetch('/api/users/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Register response:', result);
        if (response.ok) {
            localStorage.setItem('token', result.token);
            window.location.href = '/profile/';
        } else {
            document.getElementById('register-message').textContent = result.detail || 'Registration failed';
        }
    } catch (error) {
        console.error('Register error:', error);
        document.getElementById('register-message').textContent = 'Error: ' + error.message;
    }
}

async function loginUser(event) {
    event.preventDefault();
    console.log('Login form submitted');
    const form = event.target;
    const data = {
        username: form.email.value,
        password: form.password.value
    };
    try {
        const response = await fetch('/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Login response:', result);
        if (response.ok) {
            localStorage.setItem('token', result.access);
            window.location.href = '/profile/';
        } else {
            document.getElementById('login-message').textContent = result.detail || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('login-message').textContent = 'Error: ' + error.message;
    }
}

async function loadProducts(page) {
    console.log('Loading products, page:', page);
    const search = document.getElementById('search') ? document.getElementById('search').value : '';
    const url = `/api/products/?keyword=${search}&page=${page}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '';
        
        console.log('Full product data:', data);
        
        data.products.forEach(product => {
            const imageUrl = product.image;
            console.log('Product image URL:', imageUrl);
            
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded shadow';
            div.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" class="mb-2 w-full h-48 object-cover">
                <h3 class="text-lg font-bold"><a href="/product/${product._id}/">${product.name}</a></h3>
                <p>Price: $${product.price}</p>
                <p>Rating: ${product.rating} (${product.numReviews} reviews)</p>
                <button onclick="addToCart('${product._id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imageUrl}')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2">Add to Cart</button>
            `;
            productsList.appendChild(div);
        });
        
        document.getElementById('page-info').textContent = `Page ${data.page} of ${data.pages}`;
        document.getElementById('prev-page').disabled = data.page == 1;
        document.getElementById('next-page').disabled = data.page == data.pages;
        document.getElementById('prev-page').onclick = () => loadProducts(data.page - 1);
        document.getElementById('next-page').onclick = () => loadProducts(parseInt(data.page) + 1);
    } catch (error) {
        console.error('Error loading products:', error);
        const productsList = document.getElementById('products-list');
        productsList.innerHTML = '<p class="text-red-600">Error loading products. Please try again.</p>';
    }
}

function addToCart(productId, name, price, image) {
    console.log('Adding to cart:', name);
    const item = { product: productId, name, price, image, qty: 1 };
    const existing = cart.find(i => i.product == productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart`);
}

async function loadProductDetail() {
    console.log('Loading product detail');
    const id = window.location.pathname.split('/').filter(Boolean).pop();
    try {
        const response = await fetch(`/api/products/${id}/`);
        const product = await response.json();
        const detail = document.getElementById('product-detail');
        
        console.log('Full product detail:', product);
        
        const imageUrl = product.image;
        console.log('Product detail image URL:', imageUrl);
        
        detail.innerHTML = `
            <img src="${imageUrl}" alt="${product.name}" class="mb-4 max-w-full h-auto object-contain">
            <h2 class="text-2xl font-bold">${product.name}</h2>
            <p>Price: $${product.price}</p>
            <p>Brand: ${product.brand}</p>
            <p>Category: ${product.category}</p>
            <p>Description: ${product.description || 'No description'}</p>
            <p>Rating: ${product.rating} (${product.numReviews} reviews)</p>
            <p>Stock: ${product.countInStock}</p>
            <h3 class="text-xl font-bold mt-4">Reviews</h3>
            <ul>${product.reviews && product.reviews.length > 0 ? 
                product.reviews.map(r => `<li>${r.name}: ${r.rating}/5 - ${r.comment}</li>`).join('') : 
                '<li>No reviews yet</li>'}</ul>
        `;
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-detail').innerHTML = '<p class="text-red-600">Error loading product. Please try again.</p>';
    }
}

async function addReview(event) {
    event.preventDefault();
    console.log('Adding review');
    if (!token) {
        document.getElementById('review-message').textContent = 'Please login to add a review';
        return;
    }
    const form = event.target;
    const id = window.location.pathname.split('/').filter(Boolean).pop();
    const data = {
        rating: form.rating.value,
        comment: form.comment.value
    };
    try {
        const response = await fetch(`/api/products/${id}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Review response:', result);
        document.getElementById('review-message').textContent = response.ok ? 'Review added' : result.detail;
        if (response.ok) loadProductDetail();
    } catch (error) {
        console.error('Review error:', error);
        document.getElementById('review-message').textContent = 'Error: ' + error.message;
    }
}

function loadCart() {
    console.log('Loading cart');
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded shadow mb-4';
        div.innerHTML = `
            <p>${item.name} - $${item.price} x ${item.qty}</p>
            <button onclick="removeFromCart('${item.product}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Remove</button>
        `;
        cartItems.appendChild(div);
    });
}

function removeFromCart(productId) {
    console.log('Removing from cart:', productId);
    cart = cart.filter(item => item.product != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

async function placeOrder(event) {
    event.preventDefault();
    console.log('Placing order');
    if (!token) {
        document.getElementById('order-message').textContent = 'Please login to place an order';
        return;
    }
    if (cart.length === 0) {
        document.getElementById('order-message').textContent = 'Cart is empty';
        return;
    }
    const form = event.target;
    const data = {
        orderItems: cart,
        paymentMethod: form.paymentMethod.value,
        taxPrice: (cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 0.1).toFixed(2),
        shippingPrice: 10.00,
        totalPrice: (cart.reduce((sum, item) => sum + item.price * item.qty, 0) * 1.1 + 10).toFixed(2),
        shippingAddress: {
            address: form.address.value,
            city: form.city.value,
            postalCode: form.postalCode.value,
            country: form.country.value
        }
    };
    try {
        const response = await fetch('/api/orders/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Order response:', result);
        if (response.ok) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = '/orders/';
        } else {
            document.getElementById('order-message').textContent = result.detail || 'Order failed';
        }
    } catch (error) {
        console.error('Order error:', error);
        document.getElementById('order-message').textContent = 'Error: ' + error.message;
    }
}

async function loadProfile() {
    console.log('Loading profile');
    if (!token) {
        window.location.href = '/login/';
        return;
    }
    try {
        const response = await fetch('/api/users/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await response.json();
        console.log('Profile response:', user);
        document.getElementById('profile-info').innerHTML = `
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Admin: ${user.isAdmin ? 'Yes' : 'No'}</p>
        `;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
    } catch (error) {
        console.error('Profile error:', error);
        window.location.href = '/login/';
    }
}

async function updateProfile(event) {
    event.preventDefault();
    console.log('Updating profile');
    if (!token) {
        document.getElementById('profile-message').textContent = 'Please login';
        return;
    }
    const form = event.target;
    const data = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    };
    try {
        const response = await fetch('/api/users/profile/update/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log('Update profile response:', result);
        document.getElementById('profile-message').textContent = response.ok ? 'Profile updated' : result.detail;
        if (response.ok) {
            localStorage.setItem('token', result.token);
            loadProfile();
        }
    } catch (error) {
        console.error('Update profile error:', error);
        document.getElementById('profile-message').textContent = 'Error: ' + error.message;
    }
}

async function loadOrders() {
    console.log('Loading orders');
    if (!token) {
        window.location.href = '/login/';
        return;
    }
    try {
        const response = await fetch('/api/orders/myorders/', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await response.json();
        console.log('Orders response:', orders);
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = '';
        if (orders.length === 0) {
            ordersList.innerHTML = '<p>No orders found</p>';
            return;
        }
        orders.forEach(order => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded shadow mb-4';
            div.innerHTML = `
                <p>Order ID: ${order._id}</p>
                <p>Total: $${order.totalPrice}</p>
                <p>Paid: ${order.isPaid ? 'Yes' : 'No'}</p>
                <p>Delivered: ${order.isDelivered ? 'Yes' : 'No'}</p>
                <p>Items: ${order.orderItems.map(item => `${item.name} x ${item.qty}`).join(', ')}</p>
            `;
            ordersList.appendChild(div);
        });
    } catch (error) {
        console.error('Orders error:', error);
        document.getElementById('orders-list').textContent = 'Error loading orders';
    }
}

function initializePageScripts() {
    // Page-specific initialization
    if (window.location.pathname === '/orders/') {
        if (typeof loadOrders === 'function') {
            loadOrders();
        } else {
            console.error('loadOrders function not defined');
        }
    }
    // Add other page-specific initializations here if needed
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initializePageScripts();
});