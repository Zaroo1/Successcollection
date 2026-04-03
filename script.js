/* ============================================
   SUCCESS COLLECTION ONLINE - MAIN JAVASCRIPT
   With Admin Panel Sync Support
   ============================================ */

// ========== PRODUCT DATABASE - 45 CUSTOM PRODUCTS (with localStorage sync) ==========
// This allows admin panel edits to persist and reflect on the main site

// Default hardcoded products (exactly as you defined)
const DEFAULT_PRODUCTS = [
    { id: 1,  name: "Available",          price: 200, image: "1.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+1" },
    { id: 2,  name: "Available",          price: 194, image: "2.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+2" },
    { id: 3,  name: "Available",          price: 313, image: "3.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+3" },
    { id: 4,  name: "Available",          price: 157, image: "4.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+4" },
    { id: 5,  name: "Available",          price: 392, image: "5.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+5" },
    { id: 6,  name: "Available",          price: 150, image: "6.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+6" },
    { id: 7,  name: "Available",          price: 180, image: "7.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+7" },
    { id: 8,  name: "Available",          price: 600, image: "8.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+8" },
    { id: 9,  name: "Available",          price: 491, image: "9.jpg",  fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+9" },
    { id: 10, name: "Available",          price: 431, image: "10.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+10" },
    { id: 11, name: "Available",          price: 492, image: "11.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+11" },
    { id: 12, name: "Available",          price: 326, image: "12.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+12" },
    { id: 13, name: "Available",          price: 265, image: "13.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+13" },
    { id: 14, name: "Available",          price: 409, image: "14.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+14" },
    { id: 15, name: "Available",          price: 616, image: "15.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+15" },
    { id: 16, name: "Available",          price: 627, image: "16.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+16" },
    { id: 17, name: "Available",          price: 512, image: "17.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+17" },
    { id: 18, name: "Available",          price: 585, image: "18.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+18" },
    { id: 19, name: "Available",          price: 332, image: "19.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+19" },
    { id: 20, name: "Available",          price: 621, image: "20.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+20" },
    { id: 21, name: "Available",          price: 433, image: "21.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+21" },
    { id: 22, name: "Available",          price: 253, image: "22.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+22" },
    { id: 23, name: "Available",          price: 452, image: "23.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+23" },
    { id: 24, name: "Available",          price: 488, image: "24.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+24" },
    { id: 25, name: "Available",          price: 226, image: "25.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+25" },
    { id: 26, name: "Available",          price: 139, image: "26.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+26" },
    { id: 27, name: "Available",          price: 520, image: "27.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+27" },
    { id: 28, name: "Available",          price: 250, image: "28.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+28" },
    { id: 29, name: "Available",          price: 459, image: "29.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+29" },
    { id: 30, name: "Available",          price: 125, image: "30.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+30" },
    { id: 31, name: "Available",          price: 339, image: "31.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+31" },
    { id: 32, name: "Available",          price: 334, image: "32.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+32" },
    { id: 33, name: "Available",          price: 124, image: "33.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+33" },
    { id: 34, name: "Available",          price: 552, image: "34.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+34" },
    { id: 35, name: "Available",          price: 191, image: "35.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+35" },
    { id: 36, name: "Available",          price: 490, image: "36.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+36" },
    { id: 37, name: "Available",          price: 220, image: "37.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+37" },
    { id: 38, name: "Available",          price: 615, image: "38.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+38" },
    { id: 39, name: "Available",          price: 308, image: "39.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+39" },
    { id: 40, name: "Available",          price: 556, image: "40.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+40" },
    { id: 41, name: "Available",          price: 323, image: "41.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+41" },
    { id: 42, name: "Available",          price: 137, image: "42.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+42" },
    { id: 43, name: "Available",          price: 403, image: "43.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+43" },
    { id: 44, name: "Available",          price: 631, image: "44.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+44" },
    { id: 45, name: "Available",          price: 0,   image: "45.jpg", fallback: "https://placehold.co/400x500/2c2c2c/gold?text=Product+45" }
];

let productsDB = [];

// Load products: first check localStorage (admin edits), otherwise use defaults
function loadProductsFromStorage() {
    const stored = localStorage.getItem('successCart_products');
    if (stored && JSON.parse(stored).length > 0) {
        productsDB = JSON.parse(stored);
        console.log("✅ Loaded products from localStorage (admin edits applied)");
    } else {
        // First time: save defaults to localStorage and use them
        productsDB = [...DEFAULT_PRODUCTS];
        localStorage.setItem('successCart_products', JSON.stringify(productsDB));
        console.log("✅ Initialized products from defaults and saved to localStorage");
    }
    renderProducts(); // Refresh the grid
}

// Call this after any product edit (e.g., from admin panel) to keep localStorage in sync
function syncProductsToStorage() {
    localStorage.setItem('successCart_products', JSON.stringify(productsDB));
}

// ========== CART SYSTEM ==========
let cart = [];
let currentOrderData = null;

function saveCart() {
    localStorage.setItem('successCart', JSON.stringify(cart));
    updateCartUI();
}

function loadCart() {
    const stored = localStorage.getItem('successCart');
    cart = stored ? JSON.parse(stored) : [];
    updateCartUI();
}

function showToast(message, isError = false) {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.background = isError ? '#dc3545' : '#D4AF37';
    toast.style.color = isError ? 'white' : '#0B0A0A';
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    showToast(`✓ ${product.name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function updateQuantity(id, delta) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx !== -1) {
        let newQty = cart[idx].quantity + delta;
        if (newQty <= 0) {
            cart.splice(idx, 1);
        } else {
            cart[idx].quantity = newQty;
        }
        saveCart();
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartUI() {
    const container = document.getElementById('cartItemsList');
    const countSpan = document.getElementById('cartCount');
    const totalSpan = document.getElementById('cartTotal');

    let totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    countSpan.innerText = totalItems;

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding: 20px;">✨ Cart is empty ✨</div>';
        totalSpan.innerText = 'Total: GHS 0';
        return;
    }

    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.image}" onerror="this.src='${item.fallback}'">
                <div class="cart-item-details">
                    <div><strong>${item.name}</strong></div>
                    <div class="cart-item-price">GHS ${item.price}</div>
                    <div style="display:flex; gap:8px; margin-top:6px;">
                        <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
    totalSpan.innerText = `Total: GHS ${getCartTotal()}`;

    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(btn.dataset.id);
            let delta = parseInt(btn.dataset.delta);
            updateQuantity(id, delta);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
}

// ========== CART SIDEBAR CONTROLS ==========
function showCartSidebar() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

// ========== RENDER PRODUCTS (uses productsDB from localStorage) ==========
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    productsDB.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img class="product-img" src="${prod.image}" alt="${prod.name}" onerror="this.src='${prod.fallback}'">
            <div class="price-overlay">₵ ${prod.price}</div>
            <div class="product-info">
                <div class="product-title">${prod.name}</div>
                <button class="add-to-cart" data-id="${prod.id}">Add to Cart</button>
            </div>
        `;

        card.querySelector('.product-img').addEventListener('click', () => {
            document.getElementById('modalImg').src = prod.image;
            document.getElementById('imageModal').classList.add('active');
        });

        card.querySelector('.add-to-cart').addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(prod);
        });

        grid.appendChild(card);
    });
}

// ========== CHECKOUT, RECEIPT, PAYSTACK, WHATSAPP ==========
function showCheckoutModal() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", true);
        return;
    }

    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <div class="checkout-item">
                <span>${item.name} x${item.quantity}</span>
                <span>GHS ${item.price * item.quantity}</span>
            </div>
        `;
    });
    document.getElementById('checkoutItemsList').innerHTML = itemsHtml;
    document.querySelector('.checkout-total').innerHTML = `<strong>Total: GHS ${getCartTotal()}</strong>`;

    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = '';
}

function generateReceiptHTML(orderData) {
    const date = new Date().toLocaleString();
    const itemsHtml = orderData.items.map(item => `
        <div class="receipt-item">
            <span>${item.name} x${item.quantity}</span>
            <span>GHS ${item.price * item.quantity}</span>
        </div>
    `).join('');

    return `
        <div style="font-family: monospace;">
            <h2>🏆 SUCCESS COLLECTION</h2>
            <p>Luxury Streetwear & Accessories</p>
            <hr>
            <p><strong>Order #:</strong> ${orderData.orderId}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Payment Status:</strong> ${orderData.paymentStatus}</p>
            <hr>
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${orderData.customer.name}</p>
            <p><strong>Email:</strong> ${orderData.customer.email}</p>
            <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
            <p><strong>Address:</strong> ${orderData.customer.address}</p>
            ${orderData.customer.notes ? `<p><strong>Notes:</strong> ${orderData.customer.notes}</p>` : ''}
            <hr>
            <h3>Order Items</h3>
            ${itemsHtml}
            <hr>
            <h3>Total Amount: GHS ${orderData.total}</h3>
            <hr>
            <p><strong>Delivery:</strong> Free delivery within Ghana</p>
            <p><strong>Contact:</strong> 0540196090 / 0537916475</p>
            <p>Thank you for shopping with Success Collection! ❤️</p>
        </div>
    `;
}

async function storeOrderToGoogleSheets(orderData) {
    // At the top of your script.js (around line 182 in your current file)
const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbykGZwSwOZ-OEfEsX56LpD4LBKwjFbSoEkdsFyM-5WnwIIvhEFq_om-O80ZccjwYtnk/exec";
    
    if (!GOOGLE_SHEET_WEBHOOK) {
        console.log("Order saved locally:", orderData);
        return;
    }
    
    try {
        await fetch(GOOGLE_SHEET_WEBHOOK, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
    } catch (e) {
        console.warn("Google Sheets save failed:", e);
    }
}

function processPaystackPayment(orderData) {
    const PAYSTACK_PUBLIC_KEY = "pk_test_dc63b7c8f9a1e2b3c4d5e6f7a8b9c0d1e2f3a4b5";
    let totalAmount = orderData.total * 100;

    let handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: orderData.customer.email,
        amount: totalAmount,
        currency: "GHS",
        ref: 'SC_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        callback: async function (response) {
            orderData.paymentStatus = "Paid - Paystack";
            orderData.transactionRef = response.reference;
            orderData.orderId = 'SC-' + Date.now();

            await storeOrderToGoogleSheets(orderData);
            showReceipt(orderData);
            cart = [];
            saveCart();
            closeCheckoutModal();
            closeCart();
            showToast("✅ Payment successful! Your receipt is ready.");
        },
        onClose: function () {
            showToast("Payment cancelled. You can try again.", true);
        }
    });
    handler.openIframe();
}

async function processWhatsAppOrder(orderData) {
    orderData.paymentStatus = "Pending - Pay on Delivery";
    orderData.orderId = 'SC-' + Date.now();

    await storeOrderToGoogleSheets(orderData);
    showReceipt(orderData);

    const itemsText = orderData.items.map(item =>
        `• ${item.name} x${item.quantity} = GHS ${item.price * item.quantity}`
    ).join('%0A');

    const message = `🛍️ *NEW ORDER - Success Collection*%0A%0A` +
        `📋 *Order ID:* ${orderData.orderId}%0A` +
        `👤 *Name:* ${orderData.customer.name}%0A` +
        `📞 *Phone:* ${orderData.customer.phone}%0A` +
        `📧 *Email:* ${orderData.customer.email}%0A` +
        `🏠 *Address:* ${orderData.customer.address}%0A` +
        `${orderData.customer.notes ? `📝 *Notes:* ${orderData.customer.notes}%0A` : ''}` +
        `%0A*Items Ordered:*%0A${itemsText}%0A%0A` +
        `💰 *Total:* GHS ${orderData.total}%0A` +
        `💳 *Payment:* Pay on Delivery%0A%0A` +
        `🙏 Thank you for choosing Success Collection!`;

    const waLink = `https://wa.me/233540196090?text=${message}`;
    window.open(waLink, '_blank');

    cart = [];
    saveCart();
    closeCheckoutModal();
    closeCart();
    showToast("✅ Order placed! Check your receipt and WhatsApp.");
}

function showReceipt(orderData) {
    currentOrderData = orderData;
    const receiptContent = document.getElementById('receiptContent');
    receiptContent.innerHTML = generateReceiptHTML(orderData);
    document.getElementById('receiptModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ========== EVENT LISTENERS ==========
document.getElementById('placeOrderBtn').addEventListener('click', () => {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();
    const notes = document.getElementById('orderNotes').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!name || !email || !phone || !address) {
        showToast("Please fill in all required fields!", true);
        return;
    }

    if (!email.includes('@')) {
        showToast("Please enter a valid email address!", true);
        return;
    }

    const orderData = {
        customer: { name, email, phone, address, notes },
        items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
        total: getCartTotal(),
        timestamp: new Date().toISOString(),
        paymentStatus: "",
        orderId: ""
    };

    if (paymentMethod === 'paystack') {
        processPaystackPayment(orderData);
    } else {
        processWhatsAppOrder(orderData);
    }
});

document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
    if (!currentOrderData) return;
    const element = document.getElementById('receiptContent');
    html2pdf().set({
        margin: 0.5,
        filename: `Success_Collection_Receipt_${currentOrderData.orderId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
    showToast("Receipt downloaded!");
});

document.getElementById('whatsappReceiptBtn').addEventListener('click', () => {
    if (!currentOrderData) return;

    const itemsText = currentOrderData.items.map(item =>
        `• ${item.name} x${item.quantity} = GHS ${item.price * item.quantity}`
    ).join('%0A');

    const message = `🎫 *ORDER RECEIPT - Success Collection*%0A%0A` +
        `📋 *Order ID:* ${currentOrderData.orderId}%0A` +
        `👤 *Customer:* ${currentOrderData.customer.name}%0A` +
        `📅 *Date:* ${new Date(currentOrderData.timestamp).toLocaleString()}%0A` +
        `💳 *Payment:* ${currentOrderData.paymentStatus}%0A%0A` +
        `*Items Ordered:*%0A${itemsText}%0A%0A` +
        `💰 *Total Paid:* GHS ${currentOrderData.total}%0A%0A` +
        `Thank you for shopping with Success Collection! ❤️`;

    const phone = currentOrderData.customer.phone.replace(/^0/, '233');
    const waLink = `https://wa.me/${phone}?text=${message}`;
    window.open(waLink, '_blank');
    showToast("Opening WhatsApp to send receipt...");
});

document.getElementById('continueShoppingBtn').addEventListener('click', () => {
    document.getElementById('receiptModal').classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('closeReceiptBtn').addEventListener('click', () => {
    document.getElementById('receiptModal').classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('cartIcon').addEventListener('click', showCartSidebar);
document.getElementById('closeCartBtn').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('proceedCheckoutBtn').addEventListener('click', showCheckoutModal);
document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckoutModal);

document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('checkoutModal')) closeCheckoutModal();
});

document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('imageModal').classList.remove('active');
    document.body.style.overflow = '';
});

document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('imageModal')) {
        document.getElementById('imageModal').classList.remove('active');
    }
});

document.getElementById('whatsappFloatBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if (cart.length > 0) {
        const itemsText = cart.map(item => `• ${item.name} x${item.quantity} = GHS ${item.price * item.quantity}`).join('%0A');
        const message = `🛍️ *Shopping Cart - Success Collection*%0A%0A*Items:*%0A${itemsText}%0A%0A💰 *Total:* GHS ${getCartTotal()}%0A%0AI would like to place an order!`;
        window.open(`https://wa.me/233540196090?text=${message}`, '_blank');
    } else {
        window.open('https://wa.me/233540196090?text=Hello%20Success%20Collection,%20I%27m%20interested%20in%20your%20products', '_blank');
    }
});

// ========== INITIALIZE ==========
loadProductsFromStorage();  // This will load products from localStorage (admin edits) and render them
loadCart();

console.log("✅ Success Collection ready with 45 custom products + admin sync enabled! Place your images as 1.jpg to 45.jpg");