import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';

export type TableData = {
  label: string;
  value: any;
}[];

export default function TwoColsTable({ rows }: { rows: TableData }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              sx={{ '&:nth-of-type(odd)': { bgcolor: 'background.neutral' } }}
            >
              <TableCell component="th" scope="row">
                <Typography fontWeight="bold">{row.label}</Typography>
              </TableCell>

              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
