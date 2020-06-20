import {
  AppBar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import React, { Component } from "react";
import apiConfig from "../apiConfig.json";
import DepositForm from "./DepositForm";
import TransferForm from "./TransferForm";
import ShowCustomerDetails from "./ShowCustomersDetails";
import WithdrawForm from "./WithdrawForm";

const initialState = {
  showDeposit: false,
  showWithdraw: false,
  showTransfer: false,
  transactionSuccess: false,
};

export default class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      ...initialState,
      loggedIn: false,
      loggedInUsercustomerId: null,
      loggedInUserpassword: null,
      loggedInUseraccountData: {},
    };
  }

  showOrHideForms = (stateName) => {
    this.setState(initialState);
    this.setState({ [stateName]: true });
  };

  onLoginClick = (e) => {
    e.preventDefault();
    const { loggedInUsercustomerId } = this.state;
    loggedInUsercustomerId &&
      axios
        .get(apiConfig.ENDPOINT + "/" + loggedInUsercustomerId)
        .then((res) => {
          console.log("res", res);
          if (res) {
            this.setState({
              loggedInUseraccountData: res.data,
              loggedIn: true,
            });
          } else {
            alert("Enter valid Details! ");
          }
        })
        .catch((err) => {
          console.log("Error while fetching data");
        });
  };

  loginForm = () => {
    return (
      <form
        noValidate
        autoComplete="off"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <TextField
            id="outlined-basic"
            label="customer id"
            variant="outlined"
            value={this.state.loggedInUsercustomerId}
            onChange={(e) =>
              this.setState({ loggedInUsercustomerId: e.target.value })
            }
            style={{ margin: 20 }}
          />
        </div>
        <div>
          <TextField
            id="outlined-basic"
            label="password(enter 123)"
            variant="outlined"
            value={this.state.loggedInUserpassword}
            onChange={(e) =>
              this.setState({ loggedInUserpassword: e.target.value })
            }
            style={{ margin: 20 }}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={(e) => this.onLoginClick(e)}
        >
          {"Login"}
        </Button>
      </form>
    );
  };

  displayUserData = () => {
    const { loggedInUseraccountData } = this.state;
    return loggedInUseraccountData ? (
      <>
        <Typography variant="h6" style={{ textAlign: "center" }}>
          Your Account Details
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Customer Id</TableCell>
                <TableCell align="right">Account Number</TableCell>
                <TableCell align="right">Account Type</TableCell>
                <TableCell align="right">Account Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loggedInUseraccountData.map((row, index) => (
                <TableRow key={row.customer_id + "-" + index}>
                  <TableCell component="th" scope="row">
                    {row.customer_id}
                  </TableCell>
                  <TableCell align="right">{row.account_number}</TableCell>
                  <TableCell align="right">{row.account_type}</TableCell>
                  <TableCell align="right">
                    {row.account_balance.$numberDecimal}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    ) : null;
  };
  render() {
    const buttonProps = {
      variant: "contained",
      color: "primary",
      style: { margin: 20 },
    };
    const {
      showDeposit,
      showTransfer,
      showWithdraw,
      loggedIn,
      transactionSuccess,
    } = this.state;
    return (
      <>
        <AppBar position="relative" style={{ padding: 20 }}>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Banking Solution using MERN stack
          </Typography>
        </AppBar>
        <div className="col-md-8 m-auto">
          {!loggedIn && this.loginForm()}
          {loggedIn && (
            <>
              <Button
                {...buttonProps}
                onClick={() => this.showOrHideForms("showDeposit")}
              >
                {"Deposit"}
              </Button>
              <Button
                {...buttonProps}
                onClick={() => this.showOrHideForms("showWithdraw")}
              >
                {"Withdraw"}
              </Button>
              <Button
                {...buttonProps}
                onClick={() => this.showOrHideForms("showTransfer")}
              >
                {"Transfer"}
              </Button>
              {!transactionSuccess && this.displayUserData()}
            </>
          )}
          {showDeposit && (
            <DepositForm
              userAcounts={this.state.loggedInUseraccountData}
              onSuccess={() =>
                this.setState({ transactionSuccess: true, showDeposit: false })
              }
            />
          )}
          {showWithdraw && (
            <WithdrawForm
              userAcounts={this.state.loggedInUseraccountData}
              onSuccess={() =>
                this.setState({ transactionSuccess: true, showWithdraw: false })
              }
            />
          )}
          {showTransfer && (
            <TransferForm
              userAcounts={this.state.loggedInUseraccountData}
              onSuccess={() =>
                this.setState({ transactionSuccess: true, showTransfer: false })
              }
            />
          )}
          {transactionSuccess && <ShowCustomerDetails />}
        </div>
      </>
    );
  }
}
