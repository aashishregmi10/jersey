import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

/**
 * @param {{ items: Array<{ label: string, path?: string }> }} props
 */
const Breadcrumbs = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2, "& .MuiBreadcrumbs-separator": { mx: 0.5 } }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
          return (
            <Typography
              key={item.label}
              variant="body2"
              color="text.primary"
              fontWeight={600}
            >
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={item.label}
            underline="hover"
            color="text.secondary"
            variant="body2"
            sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
            onClick={() => item.path && navigate(item.path)}
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
