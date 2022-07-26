import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

export default function Loading() {
  return (
    <LoadingButton
      data-testid="loading"
      loading
      loadingPosition="start"
      startIcon={<SaveIcon />}
      variant="outlined"
    >
      Loading...
    </LoadingButton>
  );
}
