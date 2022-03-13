import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import styles from "./Result.module.css";

function createData(family, model, soc, memory, hasEthernet, hasWifi, gpio, released, discontinued) {
  return { family, model, soc, memory, hasEthernet, hasWifi, gpio, released, discontinued };
}

// const rows = [createData("Pi", "A", "BCM2835", "256 MB", false, false, "26-pin", "2013", true)];

const Result = (props) => {
  return (
    <div className={styles.Result}>
      <TableContainer component={Paper}>
        <Table sx={{ maxWidth: 850 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Family</TableCell>
              <TableCell align="center">Model</TableCell>
              <TableCell align="center">SoC</TableCell>
              <TableCell align="center">Memory</TableCell>
              <TableCell align="center">Ethernet?</TableCell>
              <TableCell align="center">Wifi?</TableCell>
              <TableCell align="center">GPIO</TableCell>
              <TableCell align="center">Released</TableCell>
              <TableCell align="center">Discontinued</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((row) => (
              <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.family}
                </TableCell>
                <TableCell align="center">{row.model}</TableCell>
                <TableCell align="center">{row.soc}</TableCell>
                <TableCell align="center">{row.memory}</TableCell>
                <TableCell align="center">{row.hasEthernet}</TableCell>
                <TableCell align="center">{row.hasWifi}</TableCell>
                <TableCell align="center">{row.gpio}</TableCell>
                <TableCell align="center">{row.released}</TableCell>
                <TableCell align="center">{row.discontinued}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

Result.propTypes = {};

Result.defaultProps = {
  data: [
    { family: "Pi", model: "A", soc: "BCM2835", memory: "256 MB", hasEthernet: false, hasWifi: false, gpio: "26-pin", released: "2013", discontinued: true },
  ],
};

export default Result;
