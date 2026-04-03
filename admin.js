/* ============================================
   SUCCESS COLLECTION - ADMIN PANEL SCRIPT
   Order Management, Product Management, Analytics
   ============================================ */

// ========== AUTHENTICATION ==========
const ADMIN_PASSWORD_KEY = 'admin_password_hash';
const DEFAULT_PASSWORD = 'admin123';

function hashPassword(pwd) {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
        hash = ((hash << 5) - hash) + pwd.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString();
}

function checkAuth() {
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (!storedHash) {
        localStorage.setItem(ADMIN_PASSWORD_KEY, hashPassword(DEFAULT_PASSWORD));
    }
    return localStorage.getItem('admin_logged_in') === 'true';
}

function login(password) {
    const storedHash = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (hashPassword(password) === storedHash) {
        localStorage.setItem('admin_logged_in', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('admin_logged_in');
    location.reload();
}

// ========== DATA STORAGE ==========
let productsData = [];
let ordersData = [];
let customersData = [];

// Load products from localStorage (synced with main site)
function loadProducts() {
    const stored = localStorage.getItem('successCart_products');
    if (stored) {
        productsData = JSON.parse(stored);
    } else {
        // Initialize with default products (45 items, all named "Available")
        const defaultProducts = [];
        for (let i = 1; i <= 45; i++) {
            defaultProducts.push({
                id: i,
                name: "Available",
                price: [200,194,313,157,392,150,180,600,491,431,492,326,265,409,616,627,512,585,332,621,433,253,452,488,226,139,520,250,459,125,339,334,124,552,191,490,220,615,308,556,323,137,403,631,0][i-1] || 100,
                image: `${i}.jpg`
            });
        }
        productsData = defaultProducts;
        saveProducts();
    }
    updateProductsTable();
    document.getElementById('totalProducts').innerText = productsData.length;
}

function saveProducts() {
    localStorage.setItem('successCart_products', JSON.stringify(productsData));
}

// ========== IMPROVED LOAD ORDERS FROM GOOGLE SHEETS ==========
async function loadOrders() {
    const webhookUrl = localStorage.getItem('google_sheets_webhook') || 'https://script.google.com/macros/s/AKfycbykGZwSwOZ-OEfEsX56LpD4LBKwjFbSoEkdsFyM-5WnwIIvhEFq_om-O80ZccjwYtnk/exec';
    
    // If no webhook URL, use demo data or localStorage
    if (!webhookUrl) {
        console.log('No Google Sheets webhook configured. Using local demo orders.');
        ordersData = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        if (ordersData.length === 0) {
            // Demo order for testing
            ordersData = [{
                orderId: 'SC-DEMO-001',
                customerName: 'Demo Customer',
                email: 'demo@example.com',
                phone: '0244123456',
                address: 'Yeji, Ghana',
                items: [{ name: 'Available', quantity: 2, price: 200 }],
                total: 400,
                paymentStatus: 'Paid - Paystack',
                status: 'Delivered',
                date: new Date().toISOString()
            }];
            localStorage.setItem('admin_orders', JSON.stringify(ordersData));
        }
        updateOrdersTable();
        updateDashboard();
        return;
    }
    
    try {
        // Fetch orders from Google Sheets (GET request)
        const response = await fetch(webhookUrl, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different possible response formats
        let fetchedOrders = [];
        if (Array.isArray(data)) {
            fetchedOrders = data;
        } else if (data.orders && Array.isArray(data.orders)) {
            fetchedOrders = data.orders;
        } else if (data.data && Array.isArray(data.data)) {
            fetchedOrders = data.data;
        } else {
            console.warn('Unexpected response format from Google Sheets:', data);
            fetchedOrders = [];
        }
        
        // Transform orders to match admin panel expected format
        ordersData = fetchedOrders.map(order => ({
            orderId: order.orderId || order.order_id || 'N/A',
            customerName: order.customerName || order.customer_name || order.customer || 'Guest',
            email: order.email || 'N/A',
            phone: order.phone || 'N/A',
            address: order.address || 'N/A',
            items: Array.isArray(order.items) ? order.items : (order.items_text ? parseItemsFromText(order.items_text) : []),
            total: parseFloat(order.total) || 0,
            paymentStatus: order.paymentStatus || order.payment_status || 'Pending',
            status: order.status || 'Pending',
            date: order.date || order.timestamp || new Date().toISOString(),
            notes: order.notes || ''
        }));
        
        // Save to localStorage as backup
        localStorage.setItem('admin_orders', JSON.stringify(ordersData));
        updateOrdersTable();
        updateDashboard();
        showToast(`Loaded ${ordersData.length} orders from Google Sheets`);
        
    } catch (error) {
        console.error('Failed to fetch orders from Google Sheets:', error);
        // Fallback to localStorage data
        ordersData = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        updateOrdersTable();
        updateDashboard();
        showToast('Could not connect to Google Sheets. Using local data.', true);
    }
}

// Helper: parse items from text format (if stored as string)
function parseItemsFromText(itemsText) {
    if (!itemsText) return [];
    const items = [];
    const parts = itemsText.split(', ');
    for (const part of parts) {
        const match = part.match(/(.+?) x(\d+) = GHS (\d+)/);
        if (match) {
            items.push({
                name: match[1],
                quantity: parseInt(match[2]),
                price: parseFloat(match[3]) / parseInt(match[2])
            });
        }
    }
    return items;
}

function saveOrders() {
    localStorage.setItem('admin_orders', JSON.stringify(ordersData));
}

// Update dashboard stats
function updateDashboard() {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
    const uniqueCustomers = [...new Set(ordersData.map(o => o.email))].length;
    
    document.getElementById('totalOrders').innerText = totalOrders;
    document.getElementById('totalRevenue').innerHTML = `GHS ${totalRevenue.toLocaleString()}`;
    document.getElementById('totalCustomers').innerText = uniqueCustomers;
    
    // Recent orders (last 5)
    const recentOrders = [...ordersData].reverse().slice(0, 5);
    const tbody = document.getElementById('recentOrdersList');
    if (tbody) {
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.orderId || 'N/A'}</td>
                <td>${order.customerName || order.customer || 'Guest'}</td>
                <td>GHS ${order.total || 0}</td>
                <td><span class="status-badge ${order.paymentStatus?.includes('Paid') ? 'status-paid' : 'status-pending'}">${order.paymentStatus || 'Pending'}</span></td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
}

// Update orders table
function updateOrdersTable() {
    const tbody = document.getElementById('ordersList');
    if (!tbody) return;
    
    tbody.innerHTML = ordersData.map(order => {
        // Safely handle items display
        let itemsDisplay = 'N/A';
        if (order.items && Array.isArray(order.items)) {
            itemsDisplay = order.items.map(i => `${i.name} x${i.quantity || i.qty}`).join(', ');
        } else if (order.items_text) {
            itemsDisplay = order.items_text.substring(0, 50);
        }
        
        return `
            <tr>
                <td>${order.orderId || 'N/A'}</td>
                <td>${order.customerName || order.customer || 'Guest'}</td>
                <td>${order.email || 'N/A'}</td>
                <td>${order.phone || 'N/A'}</td>
                <td>${itemsDisplay}</td>
                <td>GHS ${order.total || 0}</td>
                <td><span class="status-badge ${order.paymentStatus?.includes('Paid') ? 'status-paid' : 'status-pending'}">${order.paymentStatus || 'Pending'}</span></td>
                <td>
                    <select class="order-status-select" data-id="${order.orderId}">
                        <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td><button class="view-btn" data-order='${JSON.stringify(order).replace(/'/g, "&#39;")}'><i class="fas fa-eye"></i></button></td>
            </tr>
        `;
    }).join('');
    
    // Attach status change listeners
    document.querySelectorAll('.order-status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const orderId = select.dataset.id;
            const newStatus = select.value;
            const order = ordersData.find(o => o.orderId === orderId);
            if (order) {
                order.status = newStatus;
                saveOrders();
                showToast('Order status updated locally!');
                // Optionally: send status update to Google Sheets
                updateOrderStatusInSheets(orderId, newStatus);
            }
        });
    });
    
    // Attach view listeners
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                const order = JSON.parse(btn.dataset.order);
                showOrderDetails(order);
            } catch (e) {
                console.error('Failed to parse order data', e);
            }
        });
    });
}

// Optional: Send status update back to Google Sheets
async function updateOrderStatusInSheets(orderId, newStatus) {
    const webhookUrl = localStorage.getItem('google_sheets_webhook') || '';
    if (!webhookUrl) return;
    
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'updateStatus',
                orderId: orderId,
                status: newStatus
            })
        });
    } catch (error) {
        console.warn('Could not sync status to Google Sheets:', error);
    }
}

// Update products table
function updateProductsTable() {
    const tbody = document.getElementById('productsList');
    if (!tbody) return;
    
    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.src='https://placehold.co/50x50/2c2c2c/gold?text=No+Img'"></td>
            <td>${product.name}</td>
            <td>GHS ${product.price}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            editProduct(id);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('Delete this product?')) {
                productsData = productsData.filter(p => p.id !== id);
                saveProducts();
                updateProductsTable();
                document.getElementById('totalProducts').innerText = productsData.length;
                showToast('Product deleted');
            }
        });
    });
}

// Edit product modal
let currentEditId = null;

function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    currentEditId = id;
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductModal').classList.add('active');
}

// Show order details
function showOrderDetails(order) {
    const itemsHtml = order.items && Array.isArray(order.items) ? 
        order.items.map(item => `
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #2a2522;">
                <span>${item.name} x${item.quantity || item.qty}</span>
                <span>GHS ${(item.price * (item.quantity || item.qty))}</span>
            </div>
        `).join('') : '<p>No items available</p>';
    
    const content = `
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${order.customerName || order.customer}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address || 'N/A'}</p>
        <p><strong>Payment:</strong> ${order.paymentStatus}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        <hr>
        <h4>Items:</h4>
        ${itemsHtml}
        <hr>
        <h3>Total: GHS ${order.total}</h3>
    `;
    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('orderDetailsModal').classList.add('active');
}

// Show toast
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.background = isError ? '#dc3545' : '#D4AF37';
    toast.style.color = isError ? 'white' : '#0B0A0A';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '50px';
    toast.style.zIndex = '9999';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Export orders to CSV
function exportOrdersCSV() {
    let csv = "Order ID,Customer,Email,Phone,Address,Items,Total,Payment Status,Status,Date,Notes\n";
    ordersData.forEach(order => {
        const itemsText = order.items ? order.items.map(i => `${i.name} x${i.quantity}`).join('; ') : '';
        csv += `"${order.orderId}","${order.customerName || ''}","${order.email || ''}","${order.phone || ''}","${order.address || ''}","${itemsText}",${order.total || 0},"${order.paymentStatus || ''}","${order.status || 'Pending'}","${new Date(order.date).toLocaleString()}","${order.notes || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Orders exported!');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Check auth
    if (!checkAuth()) {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('adminWrapper').style.display = 'none';
    } else {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminWrapper').style.display = 'flex';
        loadProducts();
        loadOrders(); // Now properly fetches from Google Sheets
        
        // Update time
        setInterval(() => {
            const timeElement = document.getElementById('currentTime');
            if (timeElement) timeElement.innerText = new Date().toLocaleTimeString();
        }, 1000);
    }
    
    // Login handler
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const pwd = document.getElementById('adminPassword').value;
            if (login(pwd)) {
                location.reload();
            } else {
                document.getElementById('loginError').innerText = 'Invalid password!';
            }
        });
    }
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Tab switching
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const tab = item.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            const tabElement = document.getElementById(`${tab}Tab`);
            if (tabElement) tabElement.classList.add('active');
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) pageTitle.innerText = item.innerText.trim();
            
            if (tab === 'orders') loadOrders();
            if (tab === 'products') updateProductsTable();
        });
    });
    
    // Refresh orders
    const refreshBtn = document.getElementById('refreshOrdersBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => loadOrders());
    
    const refreshCustomersBtn = document.getElementById('refreshCustomersBtn');
    if (refreshCustomersBtn) refreshCustomersBtn.addEventListener('click', () => loadOrders());
    
    // Add product
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('addProductModal').classList.add('active');
        });
    }
    
    // Confirm add product
    const confirmAddBtn = document.getElementById('confirmAddProductBtn');
    if (confirmAddBtn) {
        confirmAddBtn.addEventListener('click', () => {
            const name = document.getElementById('newProductName').value.trim();
            const price = parseInt(document.getElementById('newProductPrice').value);
            const image = document.getElementById('newProductImage').value.trim();
            
            if (!name || !price) {
                showToast('Please fill name and price');
                return;
            }
            
            const newId = Math.max(...productsData.map(p => p.id), 0) + 1;
            productsData.push({
                id: newId,
                name: name,
                price: price,
                image: image || `${newId}.jpg`
            });
            saveProducts();
            updateProductsTable();
            document.getElementById('addProductModal').classList.remove('active');
            document.getElementById('totalProducts').innerText = productsData.length;
            showToast('Product added!');
            
            // Clear form
            document.getElementById('newProductName').value = '';
            document.getElementById('newProductPrice').value = '';
            document.getElementById('newProductImage').value = '';
        });
    }
    
    // Save product edit
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', () => {
            const id = parseInt(document.getElementById('editProductId').value);
            const product = productsData.find(p => p.id === id);
            if (product) {
                product.name = document.getElementById('editProductName').value;
                product.price = parseInt(document.getElementById('editProductPrice').value);
                product.image = document.getElementById('editProductImage').value;
                saveProducts();
                updateProductsTable();
                document.getElementById('editProductModal').classList.remove('active');
                showToast('Product updated!');
            }
        });
    }
    
    // Delete product from modal
    const deleteProductBtn = document.getElementById('deleteProductBtn');
    if (deleteProductBtn) {
        deleteProductBtn.addEventListener('click', () => {
            const id = parseInt(document.getElementById('editProductId').value);
            if (confirm('Delete this product permanently?')) {
                productsData = productsData.filter(p => p.id !== id);
                saveProducts();
                updateProductsTable();
                document.getElementById('editProductModal').classList.remove('active');
                document.getElementById('totalProducts').innerText = productsData.length;
                showToast('Product deleted');
            }
        });
    }
    
    // Change password
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const newPwd = document.getElementById('newPassword').value;
            if (newPwd.length < 4) {
                showToast('Password must be at least 4 characters');
                return;
            }
            localStorage.setItem(ADMIN_PASSWORD_KEY, hashPassword(newPwd));
            showToast('Password updated!');
            document.getElementById('newPassword').value = '';
        });
    }
    
    // Save webhook URL
    const saveWebhookBtn = document.getElementById('saveWebhookBtn');
    if (saveWebhookBtn) {
        saveWebhookBtn.addEventListener('click', () => {
            const url = document.getElementById('webhookUrl').value;
            localStorage.setItem('google_sheets_webhook', url);
            showToast('Webhook URL saved!');
            // Reload orders with new URL
            loadOrders();
        });
    }
    
    // Load saved webhook URL
    const savedWebhook = localStorage.getItem('google_sheets_webhook');
    const webhookInput = document.getElementById('webhookUrl');
    if (webhookInput && savedWebhook) {
        webhookInput.value = savedWebhook;
    }
    
    // Export orders
    const exportBtn = document.getElementById('exportOrdersBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportOrdersCSV);
    
    // Close modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
});