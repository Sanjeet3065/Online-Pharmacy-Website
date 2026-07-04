// ============================================
// IN-MEMORY DATABASE (Server restart = data reset)
// ============================================

let medicines = [
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

let orders = [];
let medicineIdCounter = 21;
let orderIdCounter = 1;

module.exports = {
  medicines,
  orders,
  medicineIdCounter,
  orderIdCounter
};