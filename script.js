// ============================================
// SUCCESS COLLECTION ONLINE - MAIN JAVASCRIPT
// Complete E-commerce Functionality
// ============================================

// ============================================
// PRODUCT DATA
// ============================================
const products = [
    {
        id: 1,
        name: "Luxury Gold Perfume",
        price: 350,
        description: "Premium fragrance with notes of vanilla, amber, and musk. Long-lasting scent perfect for any occasion.",
        images: [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"
        ],
        category: "perfume",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Premium Hoodie",
        price: 280,
        description: "Comfortable and stylish hoodie made from premium cotton blend. Perfect for casual wear.",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&h=400&fit=crop"
        ],
        category: "hoodie",
        badge: "New"
    },
    {
        id: 3,
        name: "Designer Sneakers",
        price: 450,
        description: "Limited edition designer sneakers with premium leather and comfortable sole.",
        images: [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop"
        ],
        category: "shoes",
        badge: "Trending"
    },
    {
        id: 4,
        name: "Summer Dress",
        price: 320,
        description: "Elegant summer dress with floral pattern. Lightweight and breathable fabric.",
        images: [
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop"
        ],
        category: "clothing",
        badge: "Sale"
    },
    {
        id: 5,
        name: "Men's Casual Shirt",
        price: 220,
        description: "Premium cotton casual shirt with modern fit. Perfect for both casual and semi-formal occasions.",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop"
        ],
        category: "clothing",
        badge: ""
    },
    {
        id: 6,
        name: "Luxury Leather Bag",
        price: 580,
        description: "Handcrafted leather bag with premium finish. Spacious and stylish.",
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop"
        ],
        category: "accessories",
        badge: "Limited"
    }
];

// ============================================
// GLOBAL VARIABLES
// ============================================
let cart = [];
let currentLocation = null;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadCartFromStorage();
    renderProducts();
    updateCartUI();
    setupEventListeners();
    detectUserLocation();
    updateCartCount();
}

// ============================================
// PRODUCT RENDERING
// ============================================
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container" onclick="openImageModal(${product.id}, 0)">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                <img src="${product.images[1]}" alt="${product.name}" class="product-image-secondary">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">GH₵ ${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                <div class="product-actions">
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-quick-view" onclick="quickViewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// CART MANAGEMENT
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    updateCartCount();
    showNotification('Added to cart!', 'success');
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div style="text-align: center; padding: 2rem;"><i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ccc;"></i><p>Your cart is empty</p></div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">GH₵ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `).join('');
    }
    
    updateCartTotals();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartUI();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    updateCartCount();
    showNotification('Item removed from cart', 'info');
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 15;
    const total = subtotal + delivery;
    
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement) subtotalElement.textContent = `GH₵ ${subtotal.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `GH₵ ${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function saveCartToStorage() {
    localStorage.setItem('successCollectionCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('successCollectionCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ============================================
// LOCATION DETECTION
// ============================================
function detectUserLocation() {
    const locationElement = document.getElementById('userLocation');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                currentLocation = { latitude, longitude };
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown';
                    locationElement.textContent = `📍 ${city}, Ghana`;
                } catch (error) {
                    locationElement.textContent = '📍 Location detected';
                }
            },
            (error) => {
                locationElement.textContent = '📍 Location access denied';
                console.log('Location error:', error);
            }
        );
    } else {
        locationElement.textContent = '📍 Geolocation not supported';
    }
}

// ============================================
// IMAGE MODAL (Product Preview)
// ============================================
function openImageModal(productId, imageIndex) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalHtml = `
        <div class="image-modal" id="imageModal">
            <div class="image-modal-content">
                <button class="close-image-modal" onclick="closeImageModal()">&times;</button>
                <img src="${product.images[imageIndex]}" alt="${product.name}" class="modal-image">
                <div class="image-navigation">
                    ${product.images.map((img, idx) => `
                        <img src="${img}" class="thumbnail ${idx === imageIndex ? 'active' : ''}" onclick="changeModalImage(${productId}, ${idx})">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = modalHtml;
    document.body.appendChild(modalDiv);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .image-modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
        }
        .close-image-modal {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        }
        .image-navigation {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        }
        .thumbnail {
            width: 60px;
            height: 60px;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
        }
        .thumbnail.active {
            border-color: var(--primary);
        }
    `;
    document.head.appendChild(style);
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) modal.remove();
}

function changeModalImage(productId, imageIndex) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalImage = document.querySelector('.modal-image');
    if (modalImage) {
        modalImage.src = product.images[imageIndex];
    }
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach((thumb, idx) => {
        if (idx === imageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function quickViewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    showNotification(`Viewing: ${product.name}`, 'info');
    // You can expand this to show a detailed modal
}

// ============================================
// CHECKOUT & PAYMENT
// ============================================
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function initializePayment() {
    const paymentMethod = document.getElementById('paymentMethod')?.value;
    const customerName = document.getElementById('customerName')?.value;
    const customerEmail = document.getElementById('customerEmail')?.value;
    const customerPhone = document.getElementById('customerPhone')?.value;
    const customerAddress = document.getElementById('customerAddress')?.value;
    
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
        showNotification('Please fill in all fields', 'error');
        return false;
    }
    
    if (paymentMethod === 'paystack') {
        processPaystackPayment(customerName, customerEmail, customerPhone, customerAddress);
    } else if (paymentMethod === 'whatsapp') {
        sendOrderViaWhatsApp(customerName, customerEmail, customerPhone, customerAddress);
    }
    
    return false;
}

function processPaystackPayment(name, email, phone, address) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 15;
    
    const handler = PaystackPop.setup({
        key: 'YOUR_PAYSTACK_PUBLIC_KEY', // Replace with your actual Paystack public key
        email: email,
        amount: total * 100, // Amount in pesewas
        currency: 'GHS',
        ref: '' + Math.floor((Math.random() * 1000000000) + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "customer_name",
                    value: name
                },
                {
                    display_name: "Phone",
                    variable_name: "customer_phone",
                    value: phone
                },
                {
                    display_name: "Address",
                    variable_name: "customer_address",
                    value: address
                }
            ]
        },
        callback: function(response) {
            saveOrderToGoogleSheets(name, email, phone, address, 'paid', response.reference);
            showNotification('Payment successful! Thank you for your order.', 'success');
            cart = [];
            saveCartToStorage();
            updateCartUI();
            updateCartCount();
            document.getElementById('checkoutModal').classList.remove('active');
        },
        onClose: function() {
            showNotification('Payment cancelled', 'info');
        }
    });
    
    handler.openIframe();
}

function sendOrderViaWhatsApp(name, email, phone, address) {
    const orderSummary = generateOrderSummary(name, email, phone, address);
    const whatsappNumber = '233598160732'; // Replace with your WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderSummary)}`;
    window.open(whatsappUrl, '_blank');
    
    // Save order to Google Sheets
    saveOrderToGoogleSheets(name, email, phone, address, 'whatsapp_pending', null);
    
    // Clear cart after order
    cart = [];
    saveCartToStorage();
    updateCartUI();
    updateCartCount();
    document.getElementById('checkoutModal').classList.remove('active');
    
    showNotification('Order sent via WhatsApp!', 'success');
}

function generateOrderSummary(name, email, phone, address) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 15;
    const total = subtotal + delivery;
    
    let orderDetails = `*SUCCESS COLLECTION ORDER*%0A%0A`;
    orderDetails += `*Customer Details*%0A`;
    orderDetails += `Name: ${name}%0A`;
    orderDetails += `Email: ${email}%0A`;
    orderDetails += `Phone: ${phone}%0A`;
    orderDetails += `Address: ${address}%0A%0A`;
    
    orderDetails += `*Order Items*%0A`;
    cart.forEach((item, index) => {
        orderDetails += `${index + 1}. ${item.name} x${item.quantity} - GH₵ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    
    orderDetails += `%0A*Subtotal:* GH₵ ${subtotal.toFixed(2)}%0A`;
    orderDetails += `*Delivery:* GH₵ ${delivery.toFixed(2)}%0A`;
    orderDetails += `*TOTAL:* GH₵ ${total.toFixed(2)}%0A%0A`;
    
    if (currentLocation) {
        orderDetails += `*Location:* ${currentLocation.latitude}, ${currentLocation.longitude}%0A`;
    }
    
    orderDetails += `%0AThank you for shopping with Success Collection!`;
    
    return orderDetails;
}

// ============================================
// GOOGLE SHEETS INTEGRATION
// ============================================
async function saveOrderToGoogleSheets(name, email, phone, address, paymentStatus, transactionRef) {
    const orderData = {
        timestamp: new Date().toISOString(),
        name: name,
        email: email,
        phone: phone,
        address: address,
        items: JSON.stringify(cart),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        delivery: 15,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15,
        payment_status: paymentStatus,
        transaction_ref: transactionRef || '',
        location: currentLocation ? `${currentLocation.latitude},${currentLocation.longitude}` : ''
    };
    
    // Google Sheets Web App URL - You'll need to set this up
    const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxzUDH5TNDuM5VzbOvm6tzU0t7GY1i3K4NrkpPCgF0jIpzaUSi0lZ9QdLi2DNCi_He8jQ/exec';
    
    try {
        const response = await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        console.log('Order saved to Google Sheets');
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // Fallback: Save to localStorage
        saveOrderLocally(orderData);
    }
}

function saveOrderLocally(orderData) {
    let orders = JSON.parse(localStorage.getItem('successCollectionOrders') || '[]');
    orders.push(orderData);
    localStorage.setItem('successCollectionOrders', JSON.stringify(orders));
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 2000;
            animation: slideIn 0.3s ease;
            border-left: 4px solid;
        }
        .notification-success {
            border-left-color: #28a745;
        }
        .notification-error {
            border-left-color: #dc3545;
        }
        .notification-info {
            border-left-color: #17a2b8;
        }
        .notification i {
            font-size: 1.2rem;
        }
        .notification-success i {
            color: #28a745;
        }
        .notification-error i {
            color: #dc3545;
        }
        .notification-info i {
            color: #17a2b8;
        }
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slideOut animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Cart panel toggle
    const cartIconBtn = document.getElementById('cartIconBtn');
    const cartPanel = document.getElementById('cartPanel');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', () => {
            cartPanel.classList.add('open');
            cartOverlay.classList.add('active');
        });
    }
    
    const closeCart = () => {
        cartPanel.classList.remove('open');
        cartOverlay.classList.remove('active');
    };
    
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // WhatsApp order button
    const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
    if (whatsappOrderBtn) {
        whatsappOrderBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                // Trigger checkout modal for WhatsApp order
                proceedToCheckout();
                // Auto-select WhatsApp payment method
                setTimeout(() => {
                    const paymentMethod = document.getElementById('paymentMethod');
                    if (paymentMethod) paymentMethod.value = 'whatsapp';
                }, 100);
            } else {
                showNotification('Your cart is empty!', 'error');
            }
        });
    }
    
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            initializePayment();
        });
    }
    
    // Close modal
    const closeModalBtn = document.getElementById('closeModalBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });
    }
    
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                checkoutModal.classList.remove('active');
            }
        });
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        });
    }
}