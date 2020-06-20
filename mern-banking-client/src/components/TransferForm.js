import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles,
  Paper,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import {
  convertionTypes,
  currencyConvert,
  currencyTypes,
} from "./utils/CurrencyConversion";
import apiConfig from "../apiConfig.json";
import Customers from "../Customers.json";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

/**
 *
 *
 * @export
 * @param {*} props
 * @returns
 */
export default function TransferForm(props) {
  console.log("props", props);
  const classes = useStyles();
  const [fromAccount, setfromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState(null);

  /**
   *
   * @param {*} fromAccount
   * @param {*} toAccount
   * @param {*} amount
   * @param {*} currency
   */
  const validateAndTransfer = (fromAccount, toAccount, amount, currency) => {
    /**
     * validates and receives the account details
     */
    axios
      .get(apiConfig.ENDPOINT + "/account/" + toAccount)
      .then((res) => {
        console.log("res", res);
        if (res) {
          performTransfer(fromAccount, toAccount, amount, currency, res.data);
        } else {
          alert("Invalid Account number . Please try again.");
        }
      })
      .catch((err) => {
        console.log("Error while validating data");
      });
  };
  /**
   *
   * @param {*} fromAccount
   * @param {*} toAccount
   * @param {*} amount
   * @param {*} currency
   * @param {*} receiverAccountDetails
   */
  const performTransfer = (
    fromAccount,
    toAccount,
    amount,
    currency,
    receiverAccountDetails
  ) => {
    /** Fetching Available balance from the selected account */
    // let senderAccBalance = props.userAcounts.find(
    //   (element) => element.account_number === fromAccount
    // ).account_balance.$numberDecimal;
    // let receiverAccBalance = receiverAccountDetails
    //   ? receiverAccountDetails[0].account_balance.$numberDecimal
    //   : 0;

    /** Convert currency to CAD before doing the transaction */
    let CADAmount = amount;
    console.log("CAD amount", CADAmount);
    if (currency !== currencyTypes.CAD) {
      CADAmount = currencyConvert(
        currency === currencyTypes.MXN
          ? convertionTypes.MXNtoCAD
          : currency === currencyTypes.USD
          ? convertionTypes.USDtoCAD
          : null,
        CADAmount
      );
    }
    // console.log("senderAccBalance balance", senderAccBalance);
    // console.log("receiverAccBalance balance", receiverAccBalance);

    // senderAccBalance = deductSenderBalance(senderAccBalance, CADAmount);
    // receiverAccBalance = addReceiverBalance(receiverAccBalance, CADAmount);

    axios
      .get(apiConfig.ENDPOINT + "/account/" + fromAccount)
      .then((res) => {
        console.log("res", res);
        if (res && res.status === 200) {
          console.log("res =====", res);
          let avaialableBalance = res.data[0].account_balance.$numberDecimal;
          if (
            avaialableBalance &&
            Number(avaialableBalance) < Number(CADAmount)
          ) {
            alert("No sufficient Balance to do this Transfer!");
          } else {
            /**Api to update db */
            axios
              .post(apiConfig.ENDPOINT + "/update/" + fromAccount, {
                account_balance: -Number(CADAmount),
              })
              .then((res) => {
                console.log("res", res);
                if (res && res.status === 200) {
                  axios
                    .post(apiConfig.ENDPOINT + "/update/" + toAccount, {
                      account_balance: Number(CADAmount),
                    })
                    .then((res) => {
                      console.log("res", res);
                      if (res && res.status === 200) {
                        props.onSuccess();
                      } else {
                        alert("Some error occured !");
                      }
                    })
                    .catch((err) => {
                      console.log("Error while fetching data", err);
                    });
                } else {
                  alert("Enter valid Details! ");
                }
              })
              .catch((err) => {
                console.log("Error while fetching data", err);
              });
          }
        } else {
          alert("Enter valid Details! ");
        }
      })
      .catch((err) => {
        console.log("Error while fetching data");
      });
  };

  return (
    <Paper elevation={3} style={{ marginTop: "10%", justifyContent: "center" }}>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Transfer Form
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">From Acc</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={fromAccount}
          onChange={(event) => setfromAccount(event.target.value)}
        >
          {props.userAcounts.map((row, index) => (
            <MenuItem value={row.account_number}>{row.account_number}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          id="outlined-basic"
          label="Enter Payee Account Number"
          variant="outlined"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Currency</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        >
          <MenuItem value={currencyTypes.CAD}>{currencyTypes.CAD}</MenuItem>
          <MenuItem value={currencyTypes.USD}>{currencyTypes.USD}</MenuItem>
          <MenuItem value={currencyTypes.MXN}>{currencyTypes.MXN}</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <TextField
          id="outlined-basic"
          label="Enter the Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        style={{ marginHorizontal: 20, marginTop: 20 }}
        onClick={(e) =>
          validateAndTransfer(fromAccount, toAccount, amount, currency)
        }
      >
        {"Transfer"}
      </Button>
    </Paper>
  );
}
