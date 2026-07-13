// =======================================================
// BACKEND SE DATA FETCH KARNE KA FUNCTION
// =======================================================
async function loadMedicines() {
    try {
        const response = await fetch('http://localhost:5000/api/medicines');
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error("Error fetching medicines:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Network error - Is backend running on port 5000?", error);
        return [];
    }
}

// =======================================================
// DISPLAY PRODUCTS ON HOMEPAGE (index.html)
// =======================================================
async function displayProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const medicines = await loadMedicines();

    if (medicines.length === 0) {
        grid.innerHTML = `<p style="text-align:center;width:100%;padding:40px;font-size:18px;">
            No medicines found. Make sure backend is running!
        </p>`;
        return;
    }

    grid.innerHTML = medicines.map(med => {
        const icon = getMedicineIcon(med.category);
        const stockStatus = med.stock > 0 ? 
            `<span class="stock in-stock">✅ In Stock</span>` : 
            `<span class="stock out-of-stock">❌ Out of Stock</span>`;
        
        return `
            <div class="product-card">
                <span class="medicine-icon">${icon}</span>
                <h3>${med.name}</h3>
                <p class="category">${med.category}</p>
                <p class="price">₹${med.price}</p>
                ${stockStatus}
                <button onclick="addToCart('${med._id}')" ${med.stock === 0 ? 'disabled' : ''}>
                    ${med.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
    }).join('');
}

// =======================================================
// MEDICINE ICONS
// =======================================================
function getMedicineIcon(category) {
    const icons = {
        'Pain Relief': '💊',
        'Antibiotics': '💊',
        'Vitamins': '💊',
        'Allergy': '💊',
        'Diabetes': '💊',
        'Heart Care': '💊',
        'Stomach Care': '💊'
    };
    return icons[category] || '💊';
}

// =======================================================
// ADD TO CART ✅ (YEH FUNCTION PEHLE MISSING THA)
// =======================================================
function addToCart(medicineId) {
    if (typeof cart === 'undefined') {
        console.error("Cart not defined! Make sure cart.js is loaded.");
        return;
    }

    loadMedicines().then(medicines => {
        const medicine = medicines.find(m => m._id === medicineId);
        if (!medicine) {
            showToast('Medicine not found!', 'error');
            return;
        }

        if (medicine.stock <= 0) {
            showToast('Sorry, out of stock!', 'error');
            return;
        }

        const existingItem = cart.find(item => item.id === medicineId);
        
        if (existingItem) {
            if (existingItem.quantity >= medicine.stock) {
                showToast('Not enough stock!', 'error');
                return;
            }
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: medicine._id,
                name: medicine.name,
                price: medicine.price,
                quantity: 1,
                maxStock: medicine.stock
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showToast(`${medicine.name} added to cart!`, 'success');
    }).catch(error => {
        console.error("Error loading medicines:", error);
        showToast('Error adding to cart', 'error');
    });
}

// =======================================================
// SEARCH FUNCTION (FIXED)
// =======================================================
async function searchMedicines() {
    const input = document.getElementById('searchInput');
    if (!input) {
        console.error("❌ Search input not found!");
        return;
    }

    const query = input.value.trim();
    console.log("🔍 Searching for:", query);

    try {
        let url = 'http://localhost:5000/api/medicines';
        if (query) {
            // ✅ Case-insensitive search ke liye lowercase bhej rahe hain
            url += `?search=${encodeURIComponent(query)}`;
        }

        console.log("📡 Fetching:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("📦 Response:", data);

        if (data.success) {
            displaySearchResults(data.data);
        } else {
            console.error("❌ Search error:", data.message);
            displaySearchResults([]);
        }
    } catch (error) {
        console.error("❌ Search error:", error);
        displaySearchResults([]);
    }
}

function displaySearchResults(medicines) {
    const grid = document.getElementById('productGrid');
    if (!grid) {
        console.error("❌ Product grid not found!");
        return;
    }

    if (!medicines || medicines.length === 0) {
        grid.innerHTML = `<p style="text-align:center;width:100%;padding:40px;font-size:18px;">
            🔍 No medicines found. Try a different search!
        </p>`;
        return;
    }

    grid.innerHTML = medicines.map(med => {
        const icon = getMedicineIcon(med.category);
        const stockStatus = med.stock > 0 ?
            `<span class="stock in-stock">✅ In Stock</span>` :
            `<span class="stock out-of-stock">❌ Out of Stock</span>`;

        return `
            <div class="product-card">
                <span class="medicine-icon">${icon}</span>
                <h3>${med.name}</h3>
                <p class="category">${med.category}</p>
                <p class="price">₹${med.price}</p>
                ${stockStatus}
                <button onclick="addToCart('${med._id}')" ${med.stock === 0 ? 'disabled' : ''}>
                    ${med.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
    }).join('');
}

// =======================================================
// DISPLAY TABLE ON all-medicines.html
// =======================================================
async function displayMedicineTable() {
    const tbody = document.getElementById('medicineTableBody');
    if (!tbody) return;

    const medicines = await loadMedicines();

    tbody.innerHTML = medicines.map((med, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${med.name}</strong></td>
            <td>${med.category}</td>
            <td>₹${med.price}</td>
            <td>${med.stock > 0 ? '✅ ' + med.stock + ' left' : '❌ Out of Stock'}</td>
            <td>
                <button onclick="addToCart('${med._id}')" class="btn-small" ${med.stock === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </td>
        </tr>
    `).join('');

    const total = document.getElementById('totalMedicines');
    if (total) total.textContent = medicines.length;
}

// =======================================================
// THEME TOGGLE
// =======================================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

// =======================================================
// INITIALIZE ON PAGE LOAD
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    displayProducts();
    displayMedicineTable();
    updateCartCount();
});

// =======================================================
// MAKE FUNCTIONS GLOBAL
// =======================================================
window.addToCart = addToCart;
window.searchMedicines = searchMedicines;
window.updateCartCount = updateCartCount;