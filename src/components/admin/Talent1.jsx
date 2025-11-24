
 

import React, { useState } from "react";
import NavBar from "../Auth/common/NavBar";
import "../../assets/css/talent1.css";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

const Talent1 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

   const talents = [
    {
      id: 1,
      name: "Liam Johnson",
      skill: "Software Development",
      status: "Active",
      location: "New York",
      date: "2023-08-12",
    },
    {
      id: 2,
      name: "Olivia Smith",
      skill: "UI/UX Design",
      status: "Inactive",
      location: "San Francisco",
      date: "2023-07-01",
    },
    {
      id: 3,
      name: "Noah Williams",
      skill: "Marketing",
      status: "Active",
      location: "London",
      date: "2023-08-22",
    },
    {
      id: 4,
      name: "Emma Brown",
      skill: "Data Analysis",
      status: "Active",
      location: "Berlin",
      date: "2023-09-05",
    },
    {
      id: 5,
      name: "James Taylor",
      skill: "Project Management",
      status: "Inactive",
      location: "Toronto",
      date: "2023-07-16",
    },
    {
      id: 6,
      name: "Ava Miller",
      skill: "Product Management",
      status: "Active",
      location: "Paris",
      date: "2023-08-27",
    },
    {
      id: 7,
      name: "Lucas Wilson",
      skill: "Content Creation",
      status: "Active",
      location: "New York",
      date: "2023-07-28",
    },
    {
      id: 8,
      name: "Mia Anderson",
      skill: "Accounting",
      status: "Inactive",
      location: "London",
      date: "2023-06-22",
    },
    {
      id: 9,
      name: "Ethan Thomas",
      skill: "Sales",
      status: "Active",
      location: "San Francisco",
      date: "2023-08-14",
    },
    {
      id: 10,
      name: "Charlotte Martin",
      skill: "Finance",
      status: "Active",
      location: "Berlin",
      date: "2023-07-09",
    },
    {
      id: 11,
      name: "Logan White",
      skill: "Customer Service",
      status: "Inactive",
      location: "Paris",
      date: "2023-06-30",
    },
    {
      id: 12,
      name: "Sophia Harris",
      skill: "Human Resources",
      status: "Active",
      location: "Toronto",
      date: "2023-08-04",
    },
    {
      id: 13,
      name: "Benjamin Clark",
      skill: "Recruitment",
      status: "Inactive",
      location: "New York",
      date: "2023-07-20",
    },
    {
      id: 14,
      name: "Isabella Lewis",
      skill: "Business Strategy",
      status: "Active",
      location: "London",
      date: "2023-08-19",
    },
    {
      id: 15,
      name: "Henry Robinson",
      skill: "Compliance",
      status: "Active",
      location: "Paris",
      date: "2023-09-02",
    },
    {
      id: 16,
      name: "Amelia Walker",
      skill: "Legal",
      status: "Inactive",
      location: "Toronto",
      date: "2023-07-04",
    },
    {
      id: 17,
      name: "Elijah Young",
      skill: "Operations Management",
      status: "Active",
      location: "Berlin",
      date: "2023-08-01",
    },
    {
      id: 18,
      name: "Emily Allen",
      skill: "Research and Development",
      status: "Active",
      location: "New York",
      date: "2023-08-29",
    },
    {
      id: 19,
      name: "William Hall",
      skill: "UI/UX Design",
      status: "Inactive",
      location: "San Francisco",
      date: "2023-07-13",
    },
    {
      id: 20,
      name: "Harper King",
      skill: "Marketing",
      status: "Active",
      location: "London",
      date: "2023-08-18",
    },
    {
      id: 21,
      name: "Alexander Wright",
      skill: "Supply Chain",
      status: "Active",
      location: "Berlin",
      date: "2023-06-25",
    },
    {
      id: 22,
      name: "Abigail Scott",
      skill: "Finance",
      status: "Inactive",
      location: "Paris",
      date: "2023-07-06",
    },
    {
      id: 23,
      name: "Daniel Green",
      skill: "Product Management",
      status: "Active",
      location: "Toronto",
      date: "2023-08-08",
    },
    {
      id: 24,
      name: "Evelyn Adams",
      skill: "Sales",
      status: "Active",
      location: "New York",
      date: "2023-08-15",
    },
    {
      id: 25,
      name: "Matthew Nelson",
      skill: "Legal",
      status: "Inactive",
      location: "San Francisco",
      date: "2023-07-23",
    },
    {
      id: 26,
      name: "Scarlett Baker",
      skill: "Human Resources",
      status: "Active",
      location: "London",
      date: "2023-07-30",
    },
    {
      id: 27,
      name: "Jackson Perez",
      skill: "Accounting",
      status: "Inactive",
      location: "Berlin",
      date: "2023-08-10",
    },
    {
      id: 28,
      name: "Victoria Roberts",
      skill: "Research and Development",
      status: "Active",
      location: "Paris",
      date: "2023-09-03",
    },
    {
      id: 29,
      name: "Sebastian Turner",
      skill: "Software Development",
      status: "Active",
      location: "Toronto",
      date: "2023-08-05",
    },
    {
      id: 30,
      name: "Aria Campbell",
      skill: "Operations Management",
      status: "Inactive",
      location: "London",
      date: "2023-07-07",
    },
  ];

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleStatusFilter = (e) => setStatusFilter(e.target.value);
  const handleSkillFilter = (e) => setSkillFilter(e.target.value);
  const handleLocationFilter = (e) => setLocationFilter(e.target.value);

  const filteredTalents = talents
    .filter((t) =>
      `${t.name} ${t.skill} ${t.location}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((t) => skillFilter === "All" || t.skill === skillFilter)
    .filter((t) => statusFilter === "All" || t.status === statusFilter)
    .filter((t) => locationFilter === "All" || t.location === locationFilter);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredTalents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTalents = filteredTalents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="talent-container">
      <NavBar />
      <div className="main-content">
        <div className="talent-head">
          <div className="talent-title">Talents</div>
          <button className="add-talent">Add Talent</button>
        </div>

        <div className="control-section">
          <div className="search-box">
            <CiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search talents"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter">
            {/** Skill Filter */}
            <div className="select-wrapper">
              <select
                value={skillFilter}
                onChange={handleSkillFilter}
                className="filter-select"
              >
                <option value="All">Skill</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Product Management">Product Management</option>
                <option value="Software Development">Software Development</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="Marketing">Marketing</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Project Management">Project Management</option>
                <option value="Business Strategy">Business Strategy</option>
                <option value="Sales">Sales</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Finance">Finance</option>
                <option value="Accounting">Accounting</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Operations Management">Operations Management</option>
                <option value="Supply Chain">Supply Chain</option>
                <option value="Legal">Legal</option>
                <option value="Compliance">Compliance</option>
                <option value="Research and Development">Research and Development</option>
                <option value="Innovation">Innovation</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>

            {/** Status Filter */}
            <div className="select-wrapper">
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="filter-select"
              >
                <option value="All">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>

            {/** Location Filter */}
            <div className="select-wrapper">
              <select
                value={locationFilter}
                onChange={handleLocationFilter}
                className="filter-select"
              >
                <option value="All">Location</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="London">London</option>
                <option value="Berlin">Berlin</option>
                <option value="Toronto">Toronto</option>
                <option value="Paris">Paris</option>
              </select>
              <IoIosArrowDown className="dropdown-icon" />
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="talent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Skills</th>
                <th>Status</th>
                <th>Join Date</th>
                <th style={{ color: "#6d028e" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTalents.map((talent) => (
                <tr key={talent.id}>
                  <td>{talent.name}</td>
                  <td className="talent-skill">{talent.skill}</td>
                  <td>
                    <div className={`status-badge ${talent.status.toLowerCase()}`}>
                      {talent.status}
                    </div>
                  </td>
                  <td className="talent-date">{talent.date}</td>
                  <td className="action-button">
                    <button onClick={() => console.log("Edit", talent.id)}>Edit/</button>
                    <button onClick={() => console.log("Delete", talent.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &#60;
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-number ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Talent1;
