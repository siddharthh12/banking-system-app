import React, { useEffect, useState } from "react";
import axios from "axios";

const BankerDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerTransactions, setCustomerTransactions] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-IN");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication error: No token found.");
      setLoadingAccounts(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        const res = await axios.get("https://banking-system-app-beta.vercel.app/api/banker/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAccounts(res.data || []);
      } catch (err) {
        setError("Failed to fetch accounts");
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  const fetchCustomerTransactions = async (customerId, customerName) => {
    setLoadingTransactions(true);
    setSelectedCustomer({ id: customerId, name: customerName });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://banking-system-app-beta.vercel.app/api/banker/customer-transactions/${customerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCustomerTransactions(res.data || []);
    } catch (err) {
      setError("Failed to fetch transactions for customer");
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleBack = () => {
    setSelectedCustomer(null);
    setCustomerTransactions([]);
    setError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login/banker";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👨‍💼 Banker Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {!selectedCustomer ? (
        <section>
          <h3 className="text-xl font-semibold border-b border-gray-700 pb-2 mb-4">
            📋 Customer Accounts
          </h3>

          {loadingAccounts ? (
            <p>Loading customer data...</p>
          ) : accounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-700 rounded">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Account ID</th>
                    <th className="p-3">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr
                      key={acc.id}
                      onClick={() => fetchCustomerTransactions(acc.id, acc.name)}
                      className="cursor-pointer hover:bg-gray-700 transition"
                    >
                      <td className="p-3">{acc.name}</td>
                      <td className="p-3">{acc.email}</td>
                      <td className="p-3">{acc.id}</td>
                      <td
                        className={`p-3 font-semibold ${
                          acc.balance >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {formatCurrency(acc.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No customer accounts found.</p>
          )}
        </section>
      ) : (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              💳 Transactions for {selectedCustomer.name}
            </h3>
            <button
              onClick={handleBack}
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
            >
              ← Back to Customers
            </button>
          </div>

          {loadingTransactions ? (
            <p>Loading transactions...</p>
          ) : customerTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border border-gray-700 rounded">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="p-3">Transaction ID</th>
                    <th className="p-3">Sender ID</th>
                    <th className="p-3">Receiver ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {customerTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-700 transition">
                      <td className="p-3">{txn.id}</td>
                      <td className="p-3">{txn.sender_id}</td>
                      <td className="p-3">{txn.receiver_id}</td>
                      <td className="p-3">{formatCurrency(txn.amount)}</td>
                      <td className="p-3 capitalize">{txn.type}</td>
                      <td className="p-3">{formatDate(txn.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No transactions found for this customer.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default BankerDashboard;
