import { Table, TableContainer, Paper } from "@mui/material";

export default function StyledTable({ children, ...props }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        background: "linear-gradient(135deg, rgba(20, 27, 45, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        "& .MuiTableHead-root": {
          background: "linear-gradient(90deg, rgba(76, 175, 80, 0.15) 0%, rgba(255, 193, 7, 0.15) 100%)",
          "& .MuiTableCell-root": {
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#4caf50",
            borderBottom: "2px solid rgba(76, 175, 80, 0.3)",
          }
        },
        "& .MuiTableBody-root .MuiTableRow-root": {
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(90deg, rgba(76, 175, 80, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)",
            transform: "scale(1.005)",
            boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)",
            cursor: "pointer",
          },
        },
        "& .MuiTableCell-root": {
          padding: "16px",
          color: "#e0e0e0",
        }
      }}
    >
      <Table {...props}>
        {children}
      </Table>
    </TableContainer>
  );
}
