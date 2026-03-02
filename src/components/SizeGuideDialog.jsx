import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const SIZE_DATA = [
  { size: "XS", chest: '32-34"', waist: '26-28"', length: '26"' },
  { size: "S", chest: '34-36"', waist: '28-30"', length: '27"' },
  { size: "M", chest: '38-40"', waist: '30-32"', length: '28"' },
  { size: "L", chest: '40-42"', waist: '32-34"', length: '29"' },
  { size: "XL", chest: '42-44"', waist: '34-36"', length: '30"' },
  { size: "XXL", chest: '44-46"', waist: '36-38"', length: '31"' },
];

const SizeGuideDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Size Guide
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          All measurements are in inches. For the best fit, measure yourself and
          compare with the chart below.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 700 }}>Size</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chest</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Waist</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Length</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SIZE_DATA.map((row) => (
                <TableRow key={row.size}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.size}</TableCell>
                  <TableCell>{row.chest}</TableCell>
                  <TableCell>{row.waist}</TableCell>
                  <TableCell>{row.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, p: 2, bgcolor: "#FFF8E1", borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            💡 How to Measure
          </Typography>
          <Typography variant="caption" color="text.secondary">
            <strong>Chest:</strong> Measure around the fullest part of your
            chest.
            <br />
            <strong>Waist:</strong> Measure around your natural waistline.
            <br />
            <strong>Length:</strong> Measure from shoulder to hem.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SizeGuideDialog;
