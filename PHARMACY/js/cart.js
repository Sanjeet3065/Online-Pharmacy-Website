

// CART DATA
let cart = [];

// BACKEND SE CART FETCH KARO
async function loadCartFromBackend() {
    try {
        const response = await fetch('http://localhost:5000/api/cart');
        const data = await response.json();

        if (data.success) {
            cart = (data.data || []).map(item => ({
                id: item.medicineId || item._id || 'unknown',
                name: item.name || 'Unknown Medicine',
                category: item.category || 'General',
                price: Number(item.price) || 0,
                quantity: Number(item.quantity) || 1,
                stock: Number(item.stock) || 0
            }));
            renderCartItems();
            updateCartCount();
        } else {
            console.error("Error loading cart:", data.message);
            cart = [];
            renderCartItems();
            updateCartCount();
        }
    } catch (error) {
        console.error("Error loading cart from backend:", error);
        cart = [];
        renderCartItems();
        updateCartCount();
    }
}

// =======================================================
// ADD TO CART
// =======================================================
async function addToCart(medicineId) {
    try {
        const response = await fetch('http://localhost:5000/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ medicineId, quantity: 1 })
        });

        const data = await response.json();

        if (data.success) {
            await loadCartFromBackend();
            showToast('✅ Item added to cart!', 'success');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        showToast('❌ Error adding to cart', 'error');
    }
}

// =======================================================
// REMOVE FROM CART
// =======================================================
async function removeFromCart(medicineId) {
    try {
        const response = await fetch(`http://localhost:5000/api/cart/remove/${medicineId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            await loadCartFromBackend();
            showToast('🗑️ Item removed from cart', 'error');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
        showToast('❌ Error removing item', 'error');
    }
}

// =======================================================
// UPDATE QUANTITY
// =======================================================
async function updateQuantity(medicineId, change) {
    const item = cart.find(i => i.id === medicineId);
    if (!item) return;

    const newQty = item.quantity + change;

    if (newQty <= 0) {
        removeFromCart(medicineId);
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/cart/update/${medicineId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQty })
        });

        const data = await response.json();

        if (data.success) {
            await loadCartFromBackend();
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) {
        console.error("Error updating quantity:", error);
        showToast('❌ Error updating quantity', 'error');
    }
}

// =======================================================
// RENDER CART ITEMS (FIXED - NaN aur undefined nahi aayega)
// =======================================================
function renderCartItems() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (!cart || cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h3>🛒 Your cart is empty</h3>
                <p>Browse our <a href="index.html">medicines</a> and add some!</p>
            </div>
        `;
        const totalElement = document.getElementById('totalPrice');
        if (totalElement) totalElement.textContent = '0';
        return;
    }

    container.innerHTML = cart.map(item => {
        const id = item.id || '';
        const name = item.name || 'Unknown Medicine';
        const category = item.category || '';
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const total = price * quantity;

        return `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-name">${name}</span>
                    ${category ? `<span class="item-category">(${category})</span>` : ''}
                    <span class="item-price">₹${price} × ${quantity}</span>
                    <span class="item-total">= ₹${total}</span>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateQuantity('${id}', -1)">−</button>
                    <span style="font-weight:600;min-width:30px;text-align:center;">${quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${id}', 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${id}')">🗑️ Remove</button>
                </div>
            </div>
        `;
    }).join('');

    const total = cart.reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0);

    const totalElement = document.getElementById('totalPrice');
    if (totalElement) totalElement.textContent = total;
}

// =======================================================
// UPDATE CART COUNT
// =======================================================
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
}

// =======================================================
// CLEAR CART
// =======================================================
async function clearCart() {
    if (!cart || cart.length === 0) {
        showToast('Cart is already empty!', 'error');
        return;
    }

    if (!confirm('Are you sure you want to clear your cart?')) return;

    try {
        for (let item of cart) {
            await fetch(`http://localhost:5000/api/cart/remove/${item.id}`, {
                method: 'DELETE'
            });
        }
        await loadCartFromBackend();
        showToast('🗑️ Cart cleared!', 'error');
    } catch (error) {
        console.error("Error clearing cart:", error);
        showToast('❌ Error clearing cart', 'error');
    }
}


// CONFIRM ORDER - FINAL
// =======================================================
async function confirmOrder() {
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty! Add some medicines first.', 'error');
        return;
    }

    if (!confirm('Confirm your order?')) return;

    try {
        // ✅ Sirf items bhejo (medicineId + quantity)
        const items = cart.map(item => ({
            medicineId: String(item.id),
            quantity: item.quantity
        }));

        console.log("📦 Sending items:", items);

        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: items })
        });

        const data = await response.json();
        console.log("📦 Response:", data);

        if (data.success) {
            const orderSummary = cart.map(item =>
                `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`
            ).join('\n');

            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            alert(`✅ ORDER CONFIRMED!\n\n${orderSummary}\n\nTotal: ₹${total}\n\nThank you for shopping at MediCare!`);

            await loadCartFromBackend();
            showToast('✅ Order placed successfully!', 'success');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (error) {
        console.error("Error placing order:", error);
        showToast('❌ Error placing order', 'error');
    }
}

// =======================================================
// TOAST NOTIFICATION
// =======================================================
function showToast(message, type = 'success') {
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 3000);
}

// =======================================================
// INITIALIZE
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromBackend();
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