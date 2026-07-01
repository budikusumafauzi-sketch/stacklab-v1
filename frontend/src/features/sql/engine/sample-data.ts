export const SAMPLE_DATABASE = {
  users: [
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin", active: true },
    { id: 2, name: "Bob Jones", email: "bob@example.com", role: "User", active: true },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "User", active: false }
  ],
  products: [
    { id: 101, name: "Mechanical Keyboard", price: 120.00, stock: 45 },
    { id: 102, name: "Wireless Mouse", price: 50.00, stock: 110 },
    { id: 103, name: "HD Monitor", price: 300.00, stock: 20 }
  ],
  orders: [
    { id: 1001, userId: 1, productId: 101, quantity: 1, total: 120.00, status: "Shipped" },
    { id: 1002, userId: 2, productId: 103, quantity: 2, total: 600.00, status: "Processing" }
  ]
};
