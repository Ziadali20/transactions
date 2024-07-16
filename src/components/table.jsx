import React, { useEffect, useState } from "react";
import { transactions, customers } from "../Data/data";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Table() {
  const [chosenCustomer, setChosenCustomer] = useState("");
  const [chosenFilter, setChosenFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const filtersType = [
    "Lowest amount",
    "highest amount",
    "A->Z",
    "Z->A",
    "Oldest",
    "Most Recent",
  ];

  useEffect(() => {
    let data = transactions.map((transaction) => {
      const customer = customers.find(
        (customer) => customer.id === transaction.customer_id
      );
      return { ...transaction, name: customer.name };
    });

    if (chosenCustomer) {
      data = data.filter((transaction) => transaction.name === chosenCustomer);
    }

    data = applyFilter(data, chosenFilter);

    setFilteredData(data);
  }, [chosenCustomer, chosenFilter]);

  const handleCustomerChange = (event) => {
    setChosenCustomer(
      event.target.value === "All customers" ? "" : event.target.value
    );
  };

  const handleFilterChange = (event) => {
    setChosenFilter(
      event.target.value === "Most Relevant" ? "" : event.target.value
    );
  };

  const applyFilter = (data, filter) => {
    switch (filter) {
      case "A->Z":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case "Z->A":
        return data.sort((a, b) => b.name.localeCompare(a.name));
      case "Lowest amount":
        return data.sort((a, b) => a.amount - b.amount);
      case "highest amount":
        return data.sort((a, b) => b.amount - a.amount);
      case "Oldest":
        return data.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "Most Recent":
        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return data;
    }
  };

  const chartData = {
    labels: filteredData.map((transaction) => transaction.name),
    datasets: [
      {
        label: 'Transaction Amount',
        data: filteredData.map((transaction) => transaction.amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="d-flex">
        <select className="form-select w-50 mx-2" onChange={handleCustomerChange}>
          <option value="All customers">All customers</option>
          {customers.map((customer) => (
            <option value={customer.name} key={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <select className="form-select w-50 mx-2" onChange={handleFilterChange}>
          <option value="Most Relevant">Most Relevant</option>
          {filtersType.map((filterType, index) => (
            <option value={filterType} key={index}>
              {filterType}
            </option>
          ))}
        </select>
      </div>

      <table className="table table-striped w-100">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.name}</td>
              <td>{transaction.date}</td>
              <td>{transaction.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <Bar data={chartData} />
      </div>
    </>
  );
}
