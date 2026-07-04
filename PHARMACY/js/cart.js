// =======================================================
// CART DATA (Stored in localStorage)
// =======================================================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// =======================================================
// ADD TO CART
// =======================================================
function addToCart(medicineId) {
    // Find the medicine
    const medicine = medicines.find(m => m.id === medicineId);
    if (!medicine) {
        showToast('Medicine not found!', 'error');
        return;
    }

    // Check stock
    if (medicine.stock <= 0) {
        showToast('Sorry, this medicine is out of stock!', 'error');
        return;
    }

    // Check if already in cart
    const existingItem = cart.find(item => item.id === medicineId);
    
    if (existingItem) {
        // Check if quantity exceeds stock
        if (existingItem.quantity >= medicine.stock) {
            showToast('Not enough stock available!', 'error');
            return;
        }
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: medicine.id,
            name: medicine.name,
            price: medicine.price,
            quantity: 1,
            maxStock: medicine.stock
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showToast(`${medicine.name} added to cart! `, 'success');
}

// =======================================================
// REMOVE FROM CART
// =======================================================
function removeFromCart(medicineId) {
    const item = cart.find(i => i.id === medicineId);
    if (!item) return;

    cart = cart.filter(i => i.id !== medicineId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    renderCartItems();
    showToast(`${item.name} removed from cart`, 'error');
}

// =======================================================
// UPDATE QUANTITY
// =======================================================
function updateQuantity(medicineId, change) {
    const item = cart.find(i => i.id === medicineId);
    if (!item) return;

    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
        removeFromCart(medicineId);
        return;
    }

    // Check max stock
    if (newQty > item.maxStock) {
        showToast('Not enough stock available!', 'error');
        return;
    }

    item.quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    renderCartItems();
}

// =======================================================
// RENDER CART ITEMS (on cart.html)
// =======================================================
function renderCartItems() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Browse our <a href="index.html">medicines</a> and add some!</p>
            </div>
        `;
        document.getElementById('totalPrice').textContent = '0';
        return;
    }

    // Display cart items
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">₹${item.price} × ${item.quantity}</span>
                <span class="item-price">= ₹${item.price * item.quantity}</span>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <span style="font-weight:600;min-width:30px;text-align:center;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})"> Remove</button>
            </div>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById('totalPrice').textContent = total;
}

// =======================================================
// UPDATE CART COUNT (shown in navbar)
// =======================================================
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounts = document.querySelectorAll('#cartCount');
    cartCounts.forEach(el => el.textContent = count);
}

// =======================================================
// CLEAR CART
// =======================================================
function clearCart() {
    if (cart.length === 0) {
        showToast('Cart is already empty!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        showToast('Cart cleared!', 'error');
    }
}

// =======================================================
// CONFIRM ORDER
// =======================================================
function confirmOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty! Add some medicines first.', 'error');
        return;
    }

    if (confirm('Confirm your order?')) {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        // Create order summary
        const orderSummary = cart.map(item => 
            `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
        ).join('\n');

        alert(`ORDER CONFIRMED!\n\n${orderSummary}\n\nTotal: ₹${total}\n\nThank you for shopping at MediCare!`);
        
        // Clear cart after order
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
        showToast('Order placed successfully! ', 'success');
    }
}

// =======================================================
// TOAST NOTIFICATION
// =======================================================
function showToast(message, type = 'success') {
    // Remove existing toast
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// =======================================================
// INITIALIZE CART PAGE
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    // Load cart items if on cart page
    if (document.getElementById('cartContainer')) {
        renderCartItems();
    }

    // Update cart count on all pages
    updateCartCount();
});

// =======================================================
// MAKE FUNCTIONS GLOBAL
// =======================================================
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.confirmOrder = confirmOrder;
window.renderCartItems = renderCartItems;
window.updateCartCount = updateCartCount;