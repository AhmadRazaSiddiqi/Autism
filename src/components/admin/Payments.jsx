import React, { useState } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/payments.css";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const payments = [
  {
    transactionId: "TXN10001",
    payerPayee: "Client: Liam Johnson",
    amount: "$500",
    date: "2023-08-12",
    status: "Paid",
  },
  {
    transactionId: "TXN10002",
    payerPayee: "Talent: Olivia Smith",
    amount: "$450",
    date: "2023-07-01",
    status: "Pending",
  },
  {
    transactionId: "TXN10003",
    payerPayee: "Talent: Noah Williams",
    amount: "$300",
    date: "2023-08-22",
    status: "Failed",
  },
  {
    transactionId: "TXN10004",
    payerPayee: "Client: Emma Brown",
    amount: "$700",
    date: "2023-09-05",
    status: "Paid",
  },
  {
    transactionId: "TXN10005",
    payerPayee: "Talent: James Taylor",
    amount: "$520",
    date: "2023-07-16",
    status: "Pending",
  },
  {
    transactionId: "TXN10006",
    payerPayee: "Client: Ava Miller",
    amount: "$670",
    date: "2023-08-27",
    status: "Paid",
  },
  {
    transactionId: "TXN10007",
    payerPayee: "Talent: Lucas Wilson",
    amount: "$330",
    date: "2023-07-28",
    status: "Paid",
  },
  {
    transactionId: "TXN10008",
    payerPayee: "Client: Mia Anderson",
    amount: "$610",
    date: "2023-06-22",
    status: "Failed",
  },
  {
    transactionId: "TXN10009",
    payerPayee: "Talent: Ethan Thomas",
    amount: "$590",
    date: "2023-08-14",
    status: "Paid",
  },
  {
    transactionId: "TXN10010",
    payerPayee: "Client: Charlotte Martin",
    amount: "$410",
    date: "2023-07-09",
    status: "Paid",
  },
  {
    transactionId: "TXN10011",
    payerPayee: "Talent: Logan White",
    amount: "$380",
    date: "2023-06-30",
    status: "Pending",
  },
  {
    transactionId: "TXN10012",
    payerPayee: "Client: Sophia Harris",
    amount: "$620",
    date: "2023-08-04",
    status: "Paid",
  },
  {
    transactionId: "TXN10013",
    payerPayee: "Talent: Benjamin Clark",
    amount: "$470",
    date: "2023-07-20",
    status: "Failed",
  },
  {
    transactionId: "TXN10014",
    payerPayee: "Client: Isabella Lewis",
    amount: "$530",
    date: "2023-08-19",
    status: "Paid",
  },
  {
    transactionId: "TXN10015",
    payerPayee: "Talent: Henry Robinson",
    amount: "$760",
    date: "2023-09-02",
    status: "Paid",
  },
  {
    transactionId: "TXN10016",
    payerPayee: "Client: Amelia Walker",
    amount: "$390",
    date: "2023-07-04",
    status: "Pending",
  },
  {
    transactionId: "TXN10017",
    payerPayee: "Talent: Elijah Young",
    amount: "$440",
    date: "2023-08-01",
    status: "Paid",
  },
  {
    transactionId: "TXN10018",
    payerPayee: "Client: Emily Allen",
    amount: "$580",
    date: "2023-08-29",
    status: "Paid",
  },
  {
    transactionId: "TXN10019",
    payerPayee: "Talent: William Hall",
    amount: "$340",
    date: "2023-07-13",
    status: "Failed",
  },
  {
    transactionId: "TXN10020",
    payerPayee: "Client: Harper King",
    amount: "$490",
    date: "2023-08-18",
    status: "Paid",
  },
  {
    transactionId: "TXN10021",
    payerPayee: "Talent: Alexander Wright",
    amount: "$710",
    date: "2023-06-25",
    status: "Pending",
  },
  {
    transactionId: "TXN10022",
    payerPayee: "Client: Abigail Scott",
    amount: "$620",
    date: "2023-07-06",
    status: "Failed",
  },
  {
    transactionId: "TXN10023",
    payerPayee: "Talent: Daniel Green",
    amount: "$530",
    date: "2023-08-08",
    status: "Paid",
  },
  {
    transactionId: "TXN10024",
    payerPayee: "Client: Evelyn Adams",
    amount: "$490",
    date: "2023-08-15",
    status: "Paid",
  },
  {
    transactionId: "TXN10025",
    payerPayee: "Talent: Matthew Nelson",
    amount: "$250",
    date: "2023-07-23",
    status: "Pending",
  },
  {
    transactionId: "TXN10026",
    payerPayee: "Client: Scarlett Baker",
    amount: "$530",
    date: "2023-07-30",
    status: "Paid",
  },
  {
    transactionId: "TXN10027",
    payerPayee: "Talent: Jackson Perez",
    amount: "$370",
    date: "2023-08-10",
    status: "Failed",
  },
  {
    transactionId: "TXN10028",
    payerPayee: "Client: Victoria Roberts",
    amount: "$690",
    date: "2023-09-03",
    status: "Paid",
  },
  {
    transactionId: "TXN10029",
    payerPayee: "Talent: Sebastian Turner",
    amount: "$770",
    date: "2023-08-05",
    status: "Paid",
  },
  {
    transactionId: "TXN10030",
    payerPayee: "Client: Aria Campbell",
    amount: "$620",
    date: "2023-07-07",
    status: "Pending",
  },
];


  // Handlers
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handleLocationFilter = (e) => setLocationFilter(e.target.value);

  // Filtering logic
  const filteredpaymentss = payments
    .filter((t) =>
      `${t.transactionId} ${t.payerPayee}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((t) => statusFilter === "All" || t.status === statusFilter)
    .filter(
      (t) =>
        locationFilter === "All" ||
        t.payerPayee.toLowerCase().startsWith(locationFilter.toLowerCase())
    );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredpaymentss.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedpaymentss = filteredpaymentss.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="payments-container">
      <NavBar />
      <div className="main-content">
        <div className="payments-head">
          <div className="payments-title">Payments</div>
          <p className="payments-description">
            Manage all transactions, including client payments and payouts
          </p>
        </div>

        <div className="control-section">
          <div className="search-box">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by transaction ID or username"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter">
            {/* Date Filter Placeholder */}
            <div className="select-wrapper">
              <select className="filter-select">
                <option>Date Range</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>

            {/* Status Filter */}
            <div className="select-wrapper">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="filter-select"
              >
                <option value="All">Status</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
                <option value="Pending">Pending</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>

            {/* User Type Filter */}
            <div className="select-wrapper">
              <select
                value={locationFilter}
                onChange={handleLocationFilter}
                className="filter-select"
              >
                <option value="All">User Type</option>
                <option value="Client">Client</option>
                <option value="Talent">Talent</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Payer/Payee</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedpaymentss.map((payment) => (
                <tr key={payment.transactionId}>
                  <td>{payment.transactionId}</td>
                  <td>{payment.payerPayee}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.date}</td>
                  <td>
                    <div
                      className={`status-badge ${payment.status.toLowerCase()}`}
                    >
                      {payment.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls (Optional) */}
        {/* Add page buttons here if needed */}
        <div className="export-button">
            <button className="export-csv">Export CSV</button>
            <button className="export-pdf">Export PDF</button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
