/* ============================================
   SUCCESS COLLECTION - ADMIN PANEL SCRIPT
   With your Google Sheets integration
   ============================================ */

// ========== AUTHENTICATION ==========
const ADMIN_PASSWORD_KEY = 'admin_password_hash';
const DEFAULT_PASSWORD = 'LordLamba123456';

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

// Load products from localStorage (synced with main site)
function loadProducts() {
    const stored = localStorage.getItem('successCart_products');
    if (stored) {
        productsData = JSON.parse(stored);
    } else {
        // Your 45 products (name = "Available", with your prices)
        productsData = [];
        const prices = [200,194,313,157,392,150,180,600,491,431,492,326,265,409,616,627,512,585,332,621,433,253,452,488,226,139,520,250,459,125,339,334,124,552,191,490,220,615,308,556,323,137,403,631,0];
        for (let i = 1; i <= 45; i++) {
            productsData.push({
                id: i,
                name: "Available",
                price: prices[i-1],
                image: `${i}.jpg`
            });
        }
        saveProducts();
    }
    updateProductsTable();
    document.getElementById('totalProducts').innerText = productsData.length;
}

function saveProducts() {
    localStorage.setItem('successCart_products', JSON.stringify(productsData));
}

// ========== LOAD ORDERS FROM YOUR GOOGLE SHEETS URL ==========
async function loadOrders() {
    const webhookUrl = "https://script.google.com/macros/s/AKfycbykGZwSwOZ-OEfEsX56LpD4LBKwjFbSoEkdsFyM-5WnwIIvhEFq_om-O80ZccjwYtnk/exec";
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        // Handle response format (could be array or object with orders)
        let fetchedOrders = Array.isArray(data) ? data : (data.orders || data.data || []);
        
        // Transform to match admin panel structure
        ordersData = fetchedOrders.map(order => ({
            orderId: order.orderId || order.order_id || 'N/A',
            customerName: order.customerName || order.customer_name || order.customer || 'Guest',
            email: order.email || 'N/A',
            phone: order.phone || 'N/A',
            address: order.address || 'N/A',
            items: order.items || (order.items_text ? parseItemsFromText(order.items_text) : []),
            total: parseFloat(order.total) || 0,
            paymentStatus: order.paymentStatus || order.payment_status || 'Pending',
            status: order.status || 'Pending',
            date: order.date || order.timestamp || new Date().toISOString(),
            notes: order.notes || ''
        }));
        
        localStorage.setItem('admin_orders', JSON.stringify(ordersData));
        updateOrdersTable();
        updateDashboard();
        showToast(`✅ Loaded ${ordersData.length} orders from Google Sheets`);
        
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        // Fallback to local backup
        ordersData = JSON.parse(localStorage.getItem('admin_orders') || '[]');
        updateOrdersTable();
        updateDashboard();
        showToast('⚠️ Using local backup (could not reach Google Sheets)', true);
    }
}

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

function updateDashboard() {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
    const uniqueCustomers = [...new Set(ordersData.map(o => o.email))].length;
    
    document.getElementById('totalOrders').innerText = totalOrders;
    document.getElementById('totalRevenue').innerHTML = `GHS ${totalRevenue.toLocaleString()}`;
    document.getElementById('totalCustomers').innerText = uniqueCustomers;
    
    // Recent orders
    const recentOrders = [...ordersData].reverse().slice(0, 5);
    const tbody = document.getElementById('recentOrdersList');
    if (tbody) {
        tbody.innerHTML = recentOrders.map(order => `
            <tr>
                <td>${order.orderId}</td>
                <td>${order.customerName}</td>
                <td>GHS ${order.total}</td>
                <td><span class="status-badge ${order.paymentStatus.includes('Paid') ? 'status-paid' : 'status-pending'}">${order.paymentStatus}</span></td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
}

function updateOrdersTable() {
    const tbody = document.getElementById('ordersList');
    if (!tbody) return;
    
    tbody.innerHTML = ordersData.map(order => `
        <tr>
            <td>${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${order.email}</td>
            <td>${order.phone}</td>
            <td>${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
            <td>GHS ${order.total}</td>
            <td><span class="status-badge ${order.paymentStatus.includes('Paid') ? 'status-paid' : 'status-pending'}">${order.paymentStatus}</span></td>
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
    `).join('');
    
    // Status change listener
    document.querySelectorAll('.order-status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const orderId = select.dataset.id;
            const newStatus = select.value;
            const order = ordersData.find(o => o.orderId === orderId);
            if (order) {
                order.status = newStatus;
                localStorage.setItem('admin_orders', JSON.stringify(ordersData));
                showToast(`Order ${orderId} status updated to ${newStatus}`);
            }
        });
    });
    
    // View details listener
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const order = JSON.parse(btn.dataset.order);
            showOrderDetails(order);
        });
    });
}

function showOrderDetails(order) {
    const itemsHtml = order.items.map(item => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #2a2522;">
            <span>${item.name} x${item.quantity}</span>
            <span>GHS ${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    const content = `
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Payment:</strong> ${order.paymentStatus}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
        <h4>Items:</h4>
        ${itemsHtml}
        <hr>
        <h3>Total: GHS ${order.total}</h3>
    `;
    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('orderDetailsModal').classList.add('active');
}

function updateProductsTable() {
    const tbody = document.getElementById('productsList');
    if (!tbody) return;
    
    tbody.innerHTML = productsData.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" style="width:50px;height:50px;object-fit:cover;border-radius:8px;" onerror="this.src='https://placehold.co/50x50/2c2c2c/gold?text=No+Img'"></td>
            <td>${product.name}</td>
            <td>GHS ${product.price}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editProduct(parseInt(btn.dataset.id)));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this product?')) {
                const id = parseInt(btn.dataset.id);
                productsData = productsData.filter(p => p.id !== id);
                saveProducts();
                updateProductsTable();
                document.getElementById('totalProducts').innerText = productsData.length;
                showToast('Product deleted');
            }
        });
    });
}

function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    document.getElementById('editProductId').value = id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductModal').classList.add('active');
}

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

function exportOrdersCSV() {
    let csv = "Order ID,Customer,Email,Phone,Address,Items,Total,Payment Status,Status,Date,Notes\n";
    ordersData.forEach(order => {
        const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join('; ');
        csv += `"${order.orderId}","${order.customerName}","${order.email}","${order.phone}","${order.address}","${itemsText}",${order.total},"${order.paymentStatus}","${order.status}","${new Date(order.date).toLocaleString()}","${order.notes || ''}"\n`;
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
    if (!checkAuth()) {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('adminWrapper').style.display = 'none';
    } else {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminWrapper').style.display = 'flex';
        loadProducts();
        loadOrders();
        setInterval(() => {
            const timeEl = document.getElementById('currentTime');
            if (timeEl) timeEl.innerText = new Date().toLocaleTimeString();
        }, 1000);
    }
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        const pwd = document.getElementById('adminPassword').value;
        if (login(pwd)) location.reload();
        else document.getElementById('loginError').innerText = 'Invalid password!';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const tab = item.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(`${tab}Tab`).classList.add('active');
            document.getElementById('pageTitle').innerText = item.innerText.trim();
            if (tab === 'orders') loadOrders();
            if (tab === 'products') updateProductsTable();
        });
    });
    
    document.getElementById('refreshOrdersBtn')?.addEventListener('click', loadOrders);
    document.getElementById('refreshCustomersBtn')?.addEventListener('click', loadOrders);
    
    document.getElementById('addProductBtn')?.addEventListener('click', () => {
        document.getElementById('addProductModal').classList.add('active');
    });
    
    document.getElementById('confirmAddProductBtn')?.addEventListener('click', () => {
        const name = document.getElementById('newProductName').value.trim();
        const price = parseInt(document.getElementById('newProductPrice').value);
        const image = document.getElementById('newProductImage').value.trim();
        if (!name || !price) { showToast('Fill name and price'); return; }
        const newId = Math.max(...productsData.map(p => p.id), 0) + 1;
        productsData.push({ id: newId, name, price, image: image || `${newId}.jpg` });
        saveProducts();
        updateProductsTable();
        document.getElementById('addProductModal').classList.remove('active');
        document.getElementById('totalProducts').innerText = productsData.length;
        showToast('Product added!');
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductPrice').value = '';
        document.getElementById('newProductImage').value = '';
    });
    
    document.getElementById('saveProductBtn')?.addEventListener('click', () => {
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
    
    document.getElementById('deleteProductBtn')?.addEventListener('click', () => {
        const id = parseInt(document.getElementById('editProductId').value);
        if (confirm('Delete permanently?')) {
            productsData = productsData.filter(p => p.id !== id);
            saveProducts();
            updateProductsTable();
            document.getElementById('editProductModal').classList.remove('active');
            document.getElementById('totalProducts').innerText = productsData.length;
            showToast('Product deleted');
        }
    });
    
    document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
        const newPwd = document.getElementById('newPassword').value;
        if (newPwd.length < 4) { showToast('Password min 4 chars'); return; }
        localStorage.setItem(ADMIN_PASSWORD_KEY, hashPassword(newPwd));
        showToast('Password updated!');
        document.getElementById('newPassword').value = '';
    });
    
    document.getElementById('exportOrdersBtn')?.addEventListener('click', exportOrdersCSV);
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.remove('active'));
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.classList.remove('active');
    });
});