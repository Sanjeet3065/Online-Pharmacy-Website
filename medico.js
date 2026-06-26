let orders = JSON.parse(localStorage.getItem("orders")) || [];

let selectedRow = null;
let selectedPrice = 0;


const tbody = document.querySelector("tbody");

const searchInput = document.getElementById("searchInput");
const noData = document.getElementById("noData");

const modal = document.getElementById("editModal");

let currentRow = null;



function updateDashboard() {

    const rows = document.querySelectorAll("tbody tr");

    document.getElementById("medicineCount").innerText =
        rows.length;

    const categories = new Set();

    rows.forEach((row) => {
        categories.add(row.cells[1].innerText);
    });

    document.getElementById("categoryCount").innerText =
        categories.size;
}

updateDashboard();



searchInput.addEventListener("keyup", () => {

    const value =
        searchInput.value.toLowerCase();

    const rows =
        document.querySelectorAll("tbody tr");

    let found = false;

    rows.forEach((row) => {

        const medicine =
            row.cells[0].innerText.toLowerCase();

        const category =
            row.cells[1].innerText.toLowerCase();

        if (
            medicine.includes(value) ||
            category.includes(value)
        ) {
            row.style.display = "";
            found = true;
        }
        else {
            row.style.display = "none";
        }

    });

    noData.style.display =
        found ? "none" : "block";

});



function attachEvents(row) {

   // view

row.querySelector(".view-btn")
.addEventListener("click", function () {

    selectedRow = row;

    const name = row.cells[0].innerText;
    selectedPrice = parseFloat(row.cells[2].innerText.replace("₹",""));

    document.getElementById("orderName").value = name;
    document.getElementById("orderQty").value = "";
    document.getElementById("orderTotal").innerText = "Total: ₹0";

    document.getElementById("orderModal").style.display = "flex";
});


document.getElementById("orderQty")
.addEventListener("input", function () {

    let qty = this.value;
    let total = qty * selectedPrice;

    if(!qty || qty <= 0) total = 0;

    document.getElementById("orderTotal").innerText =
        "Total: ₹" + total;
});



document.getElementById("placeOrderBtn")
.addEventListener("click", function () {

    const name = document.getElementById("orderName").value;
    const qty = parseInt(document.getElementById("orderQty").value);

    if(!qty || qty <= 0){
        return;
    }

    const stock = parseInt(selectedRow.cells[3].innerText);

    if(qty > stock){
        return;
    }

    const total = qty * selectedPrice;

    orders.push({
        name,
        qty,
        price: selectedPrice,
        total,
        status: "pending"
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    updateOrderCount();
    updateOrderBadge();

    document.getElementById("orderModal").style.display = "none";

    document.getElementById("orderQty").value = "";
    document.getElementById("orderTotal").innerText = "Total: ₹0";
});




document.getElementById("closeOrderBtn")
.addEventListener("click", function () {
    document.getElementById("orderModal").style.display = "none";
});


// edit
    row.querySelector(".edit-btn")
        .addEventListener("click", function () {

            currentRow = row;

            document.getElementById("editName").value =
                row.cells[0].innerText;

            document.getElementById("editCategory").value =
                row.cells[1].innerText;

            document.getElementById("editPrice").value =
                row.cells[2].innerText.replace("₹", "");

            document.getElementById("editStock").value =
                row.cells[3].innerText;

            modal.style.display = "flex";

        });

// delete

    row.querySelector(".delete-btn")
        .addEventListener("click", function () {

            const confirmDelete =
                confirm("Delete this medicine?");

            if (confirmDelete) {

                row.remove();

                updateDashboard();
            }

        });

}

// exixting row

document.querySelectorAll("tbody tr")
    .forEach((row) => {
        attachEvents(row);
    });


document.getElementById("closeBtn")
    .addEventListener("click", () => {

        modal.style.display = "none";

    });

document.getElementById("updateBtn")
    .addEventListener("click", () => {

        currentRow.cells[0].innerText =
            document.getElementById("editName").value;

        currentRow.cells[1].innerText =
            document.getElementById("editCategory").value;

        currentRow.cells[2].innerText =
            "₹" +
            document.getElementById("editPrice").value;

        let stock =
            document.getElementById("editStock").value;

        currentRow.cells[3].innerText =
            stock;

        if (stock == 0) {

            currentRow.cells[4].innerHTML =
                `<span class="status outstock">
                Out of Stock
                </span>`;

        }
        else if (stock <= 20) {

            currentRow.cells[4].innerHTML =
                `<span class="status lowstock">
                Low Stock
                </span>`;

        }
        else {

            currentRow.cells[4].innerHTML =
                `<span class="status instock">
                In Stock
                </span>`;

        }

        modal.style.display = "none";

        updateDashboard();

    });


const addBtn =
    document.querySelector(".form button");

addBtn.addEventListener("click", () => {

    const name =
        document.getElementById("mname").value;

    const category =
        document.getElementById("categorylist").value;

    const price =
        document.getElementById("price").value;

    const stock =
        document.getElementById("stock").value;

    if (
        name === "" ||
        category === "" ||
        price === "" ||
        stock === ""
    ) {
        alert("Please fill all fields");
        return;
    }

    let statusClass = "";
    let statusText = "";

    if (stock == 0) {

        statusClass = "outstock";
        statusText = "Out of Stock";

    }
    else if (stock <= 20) {

        statusClass = "lowstock";
        statusText = "Low Stock";

    }
    else {

        statusClass = "instock";
        statusText = "In Stock";

    }

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>${name}</td>
        <td>${category}</td>
        <td>₹${price}</td>
        <td>${stock}</td>
        <td>
            <span class="status ${statusClass}">
                ${statusText}
            </span>
        </td>
        <td>
            <button class="action view-btn">
                View
            </button>

            <button class="edit edit-btn">
                Edit
            </button>

            <button class="delete delete-btn">
                Delete
            </button>
        </td>
    `;

    tbody.appendChild(row);

    attachEvents(row);

    updateDashboard();

    alert("Medicine Added Successfully!");
    document.getElementById("mname").value = "";
    document.getElementById("categorylist").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";

});





function updateDashboard() {

    const rows =
        document.querySelectorAll("tbody tr");

    document.getElementById("medicineCount").innerText =
        rows.length;

    const categories = new Set();

    let lowStock = 0;

    rows.forEach((row) => {

        categories.add(
            row.cells[1].innerText
        );

        const stock =
            parseInt(row.cells[3].innerText);

        if(stock > 0 && stock <= 20){
            lowStock++;
        }

    });

    document.getElementById("categoryCount").innerText =
        categories.size;

    document.getElementById("lowStockCount").innerText =
        lowStock;
}



// light mode dark mode


const darkBtn =
document.getElementById("darkModeBtn");

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark-mode");

    if(
        document.body.classList.contains("dark-mode")
    ){
        darkBtn.innerHTML = "☀️";
    }
    else{
        darkBtn.innerHTML = "🌙";
    }

});



// order update


function updateOrderBadge() {
    document.getElementById("orderBadge").innerText = orders.length;
}
updateOrderBadge();


function updateOrderCount() {
    document.getElementById("orderCount").innerText = orders.length;
}

updateOrderCount();




