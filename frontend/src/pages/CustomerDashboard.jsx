import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const API_URL = "https://banking-system-app-beta.vercel.app";

  useEffect(() => {
    if (!userId) {
      navigate("/customer/login");
      return;
    }

    // ✅ Fetch account details
    fetch(`${API_URL}/api/customer/account/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Account fetch failed");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => {
        console.error("Account fetch error", err);
        alert("Failed to fetch account details. Please try again.");
      });

    // ✅ Fetch transactions
    fetch(`${API_URL}/api/customer/transactions/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Transaction fetch failed");
        return res.json();
      })
      .then(data => setTransactions(data))
      .catch(err => {
        console.error("Transaction fetch error", err);
        alert("Failed to fetch transaction history.");
      });
  }, [userId]);

  const handleTransaction = () => {
    if (!amount || amount <= 0) return alert("Enter valid amount");

    fetch(`${API_URL}/api/customer/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount: parseFloat(amount) }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Transaction failed");
        return res.json();
      })
      .then(data => {
        alert(data.message || "Transaction successful");
        setAmount("");

        return Promise.all([
          fetch(`${API_URL}/api/customer/account/${userId}`).then(res => res.json()),
          fetch(`${API_URL}/api/customer/transactions/${userId}`).then(res => res.json()),
        ]);
      })
      .then(([updatedUser, updatedTransactions]) => {
        setUser(updatedUser);
        setTransactions(updatedTransactions);
      })
      .catch(err => {
        console.error("Transaction error:", err);
        alert("Transaction failed. Please try again.");
      });
  };

  const logout = () => {
    localStorage.clear();
    navigate("/customer/login");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f4f4",
      padding: "2rem",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>💼 Customer Dashboard</h2>

        {user && (
  <div style={{ marginBottom: "1.5rem" }}>
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Balance:</strong> ₹{Number(user?.balance ?? 0).toFixed(2)}</p>
    </div>
)}


        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              backgroundColor: "#fafafa"
            }}
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
          </select>

          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: "0.5rem",
              flex: 1,
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={handleTransaction}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {type === "deposit" ? "Deposit" : "Withdraw"}
          </button>
        </div>

        <h3 style={{ marginTop: "2rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
          🧾 Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p style={{ marginTop: "1rem" }}>No transactions yet.</p>
        ) : (
          <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
            {transactions.map((txn, idx) => (
              <li
                key={idx}
                style={{
                  padding: "0.75rem",
                  marginBottom: "0.5rem",
                  backgroundColor: txn.type === "deposit" ? "#e6ffed" : "#ffe6e6",
                  borderRadius: "6px",
                  borderLeft: txn.type === "deposit" ? "4px solid green" : "4px solid red"
                }}
              >
                <strong>{txn.type.toUpperCase()}</strong> ₹{txn.amount} - {txn.description} <br />
                <small style={{ color: "#666" }}>{new Date(txn.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={logout}
          style={{
            marginTop: "2rem",
            backgroundColor: "red",
            color: "#fff",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "block",
            width: "100%"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CustomerDashboard;
