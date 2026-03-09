import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function Invoice() {
  const { tripId } = useParams();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    api.get('/api/expenses/${tripId}').then((res) => {
      setExpenses(res.data);
    });
  }, [tripId]);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={{ padding: 30 }}>
      <h2>Invoice</h2>
      <p><b>Trip ID:</b> {tripId}</p>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th align="left">Type</th>
            <th align="left">Amount</th>
            <th align="left">Added By</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.expenseId}>
              <td>{e.type}</td>
              <td>₹{e.amount}</td>
              <td>{e.addedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>Total: ₹{total}</h3>
    </div>
  );
}