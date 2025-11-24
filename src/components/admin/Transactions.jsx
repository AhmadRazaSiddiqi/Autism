import React from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/transactions.css"; // using same CSS base

function Transactions() {
  const transaction = {
    id: "TXN-2023-12345",
    date: "October 26, 2023",
    amount: 500,
    status: "Completed",
    invoice: "INV-2023-67890",
    client: "Tech Solutions Inc.",
    talent: "Sarah Johnson",
    method: "Credit Card (**** **** **** 1234)",
    fee: 25,
    statusHistory: [
      { status: "Initiated", timestamp: "October 26, 2023, 10:00 AM" },
      { status: "Processed", timestamp: "October 26, 2023, 10:15 AM" },
      { status: "Completed", timestamp: "October 26, 2023, 10:30 AM" },
    ],
  };

  return (
    <div className="clients-container">
      <NavBar />
      <div className="main-content">
        <nav className="breadcrumb">
          <a href="#">Payments</a> / <a href="#">Transactions</a> /{" "}
          <span className="transaction-id" style={{ color: "black" }}>
            {transaction.id}
          </span>
        </nav>

        <h1 className="clients-title">Transaction Details</h1>
        <p className="description">
          View the full transaction breakdown, status history, and options for
          refunds or disputes.
        </p>

        {/* Transaction Overview */}
        <div className="table-container">
          <Section title="Transaction Overview">
            <DetailRow label="Transaction ID" value={transaction.id} />
            <DetailRow label="Date" value={transaction.date} />
            <DetailRow label="Amount" value={`$${transaction.amount}`} />
            <DetailRow label="Status" value={transaction.status} />
          </Section>

          {/* Invoice Details */}
          <Section title="Invoice Details">
            <DetailRow label="Invoice Number" value={transaction.invoice} />
            <DetailRow label="Client" value={transaction.client} />
            <DetailRow label="Talent" value={transaction.talent} />
          </Section>

          {/* Payment Method */}
          <Section title="Payment Method">
            <DetailRow label="Method" value={transaction.method} />
          </Section>

          {/* Fees */}
          <Section title="Fees">
            <DetailRow label="Platform Fee" value={`$${transaction.fee}`} />
          </Section>

          {/* Status History */}
          <Section title="Status History">
            <ul className="status-list">
              {transaction.statusHistory.map((item, index) => (
                <li key={index} className="status-history-row">
                  <span className="status-circle"></span>
                  <span>{item.status}</span>
                  <span style={{ color: "#6d028e" }}>{item.timestamp}</span>
                </li>
              ))}
            </ul>
          </Section>
          {/* Actions */}
          <Section title="Actions">
            <div className="actions">
              <button className="refund-btn">Initiate Refund</button>
              <button className="dispute-btn">Start Dispute Resolution</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <div className="section">
    <h2 className="section-title">{title}</h2>
    {children}
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="row">
    <div className="label">{label}</div>
    <div className="value">{value}</div>
  </div>
);

export default Transactions;
