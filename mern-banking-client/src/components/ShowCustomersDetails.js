import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import axios from "axios";
import apiConfig from "../apiConfig.json";

class ShowCustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
    };
  }

  componentDidMount() {
    axios
      .get(apiConfig.ENDPOINT + "/")
      .then((res) => {
        console.log("showCustomerDetails-API-response: ", res.data);
        this.setState({
          customers: res.data,
        });
      })
      .catch((err) => {
        console.log("Error from showCustomerDetails");
      });
  }

  render() {
    const { customers } = this.state;
    let tableBody = customers && (
      <tbody>
        {customers.map((item, index) => (
          <tr>
            <th scope="row">1</th>
            <td>{item.customer_id}</td>
            <td>{item.customer_name}</td>
            <td>{item.account_number}</td>
            <td>{item.account_balance.$numberDecimal}</td>
          </tr>
        ))}
      </tbody>
    );
    let CustomerRow = (
      <div>
        <table className="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Id</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Account Number</th>
              <th scope="col">Balance</th>
            </tr>
          </thead>
          {tableBody}
        </table>
      </div>
    );

    return (
      <div className="ShowBookDetails">
        <div className="container">
          <div className="row">
            <div className="col-md-10 m-auto">{CustomerRow}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShowCustomerDetails;
