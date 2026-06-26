let orders = JSON.parse(localStorage.getItem("orders")) || [];


const rejectPopup = document.getElementById("rejectPopup");


function renderOrders(){

    const container = document.getElementById("orderContainer");
    container.innerHTML = "";

    orders.forEach((o, i) => {

        const div = document.createElement("div");

        div.style = "border:1px solid #ccc; margin:10px; padding:10px; border-radius:8px;";

        div.innerHTML = `
            <h3>${o.name}</h3>
            <p>Qty: ${o.qty}</p>
            <p>Total: ₹${o.total}</p>
            <p>Status: ${o.status === "accepted" ? "✅ Accepted" : "Pending"}</p>

            <button onclick="acceptOrder(${i})" style="background:green;color:white;padding:5px 10px;margin-right:5px;">
                Accept
            </button>

            <button onclick="rejectOrder(${i})" style="background:red;color:white;padding:5px 10px;">
                Reject
            </button>
        `;

        container.appendChild(div);
    });
}

function acceptOrder(index){

    orders[index].status = "accepted";

    localStorage.setItem("orders", JSON.stringify(orders));

    renderOrders();
}

function rejectOrder(index){

    orders.splice(index, 1);

    localStorage.setItem("orders", JSON.stringify(orders));

    renderOrders();

    rejectPopup.style.display = "flex";
}



renderOrders();

document.getElementById("rejectOkBtn")
.addEventListener("click", function () {

    rejectPopup.style.display = "none";

});



