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
export default function WithdrawForm(props) {
  console.log("props", props);
  const classes = useStyles();
  const [fromAccount, setfromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState(null);

  /**
   *
   * @param {*} fromAccount
   * @param {*} amount
   * @param {*} currency
   */
  const onWithdrawClick = (fromAccount, amount, currency) => {
    let CADAmount = amount;
    /** Convert currency to CAD before depositing */
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
    /**Api to update db */
    axios
      .get(apiConfig.ENDPOINT + "/account/" + fromAccount)
      .then((res) => {
        if (res && res.status === 200) {
          let avaialableBalance = res.data[0].account_balance.$numberDecimal;
          if (
            avaialableBalance &&
            Number(avaialableBalance) < Number(CADAmount)
          ) {
            alert("No sufficient Balance to do this Winthdrawal!");
          } else {
            axios
              .post(apiConfig.ENDPOINT + "/update/" + fromAccount, {
                account_balance: -Number(CADAmount),
              })
              .then((res) => {
                console.log("res", res);
                if (res && res.status === 200) {
                  alert("Withdrawal Successful!");
                  props.onSuccess();
                } else {
                  alert("Enter valid Details! ");
                }
              })
              .catch((err) => {
                console.log("Error while fetching data");
              });
          }
        }
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  return (
    <Paper elevation={3} style={{ marginTop: "10%", justifyContent: "center" }}>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Withdrawal Form
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
        onClick={(e) => onWithdrawClick(fromAccount, amount, currency)}
      >
        {"Withdraw"}
      </Button>
    </Paper>
  );
}
