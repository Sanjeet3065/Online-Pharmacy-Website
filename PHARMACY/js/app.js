// =======================================================
// MEDICINE DATA - 20 Medicines (as requested)
// =======================================================
const medicines = [
    { id: 1, name: "Paracetamol 500mg", category: "Pain Relief", price: 45, stock: 50 },
    { id: 2, name: "Amoxicillin 250mg", category: "Antibiotics", price: 120, stock: 30 },
    { id: 3, name: "Vitamin C 1000mg", category: "Vitamins", price: 85, stock: 60 },
    { id: 4, name: "Aspirin 75mg", category: "Pain Relief", price: 60, stock: 40 },
    { id: 5, name: "Azithromycin 500mg", category: "Antibiotics", price: 200, stock: 20 },
    { id: 6, name: "Vitamin D3 2000IU", category: "Vitamins", price: 150, stock: 45 },
    { id: 7, name: "Ibuprofen 400mg", category: "Pain Relief", price: 80, stock: 35 },
    { id: 8, name: "Cetirizine 10mg", category: "Allergy", price: 55, stock: 55 },
    { id: 9, name: "Metformin 500mg", category: "Diabetes", price: 95, stock: 25 },
    { id: 10, name: "Atorvastatin 10mg", category: "Heart Care", price: 180, stock: 28 },
    { id: 11, name: "Omeprazole 20mg", category: "Stomach Care", price: 70, stock: 40 },
    { id: 12, name: "Amoxicillin 500mg", category: "Antibiotics", price: 160, stock: 22 },
    { id: 13, name: "Vitamin B12 1000mcg", category: "Vitamins", price: 120, stock: 38 },
    { id: 14, name: "Diclofenac 50mg", category: "Pain Relief", price: 65, stock: 33 },
    { id: 15, name: "Clarithromycin 500mg", category: "Antibiotics", price: 250, stock: 15 },
    { id: 16, name: "Calcium 500mg", category: "Vitamins", price: 90, stock: 50 },
    { id: 17, name: "Losartan 50mg", category: "Heart Care", price: 140, stock: 30 },
    { id: 18, name: "Pantoprazole 40mg", category: "Stomach Care", price: 75, stock: 42 },
    { id: 19, name: "Montelukast 10mg", category: "Allergy", price: 110, stock: 25 },
    { id: 20, name: "Glibenclamide 5mg", category: "Diabetes", price: 85, stock: 20 }
];

// =======================================================
// DISPLAY PRODUCTS ON HOMEPAGE (index.html)
// =======================================================
function displayProducts(productList) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    if (productList.length === 0) {
        grid.innerHTML = `<p style="text-align:center;width:100%;padding:40px;font-size:18px;">
            No medicines found. Try a different search!
        </p>`;
        return;
    }

    grid.innerHTML = productList.map(med => {
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
                <button onclick="addToCart(${med.id})" ${med.stock === 0 ? 'disabled' : ''}>
                    ${med.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
    }).join('');
}

// =======================================================
// MEDICINE ICONS (for fun display)
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
// SEARCH FUNCTION
// =======================================================
function searchMedicines() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    
    if (query === '') {
        displayProducts(medicines);
        return;
    }

    const filtered = medicines.filter(med => 
        med.name.toLowerCase().includes(query) ||
        med.category.toLowerCase().includes(query)
    );

    displayProducts(filtered);
}

// =======================================================
// DISPLAY TABLE ON all-medicines.html
// =======================================================
function displayMedicineTable() {
    const tbody = document.getElementById('medicineTableBody');
    if (!tbody) return;

    tbody.innerHTML = medicines.map((med, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${med.name}</strong></td>
            <td>${med.category}</td>
            <td>₹${med.price}</td>
            <td>${med.stock > 0 ? '✅ ' + med.stock + ' left' : '❌ Out of Stock'}</td>
            <td>
                <button onclick="addToCart(${med.id})" class="btn-small" ${med.stock === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </td>
        </tr>
    `).join('');

    const total = document.getElementById('totalMedicines');
    if (total) total.textContent = medicines.length;
}

// =======================================================
// THEME TOGGLE (Dark / Light Mode)
// =======================================================
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Change button icon
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Load saved theme
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
    // Load theme
    loadTheme();

    // Theme toggle button
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    // Display products on homepage
    displayProducts(medicines);

    // Display table on all-medicines page
    displayMedicineTable();

    // Update cart count
    updateCartCount();
});

// =======================================================
// MAKE FUNCTIONS GLOBAL (for onclick in HTML)
// =======================================================
window.searchMedicines = searchMedicines;
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;