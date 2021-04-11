import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  GridCellParams,
  GridColumns,
  GridRowsProp,
  useGridApiRef,
  GridEditRowModelParams,
  XGrid,
} from "@material-ui/x-grid";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles({
  checkbox: {
    // centering the checkbox inside the cell
    margin: "0 auto",
  },
});

const CheckboxCell: (
  params: GridCellParams
) => React.ReactElement<GridCellParams, any> = ({
  id,
  field,
  api,
  cellMode,
  value,
}) => {
  const classes = useStyles();

  const handleChange = React.useCallback(
    (event, value) => {
      api.setEditCellProps({
        id,
        field,
        props: {
          value: Number(value),
        },
      });
    },
    [api, field, id]
  );

  return (
    <Checkbox
      classes={{ root: classes.checkbox }}
      checked={!!value}
      disabled={cellMode === "view"}
      onChange={handleChange}
    />
  );
};

const columns: GridColumns = [
  {
    field: "country",
    headerName: "Country",
    width: 120,
    editable: false,
    align: "center",
  },
  {
    field: "status1",
    headerName: "Status 1",
    type: "number",
    width: 120,
    editable: true,
    renderEditCell: CheckboxCell,
    renderCell: CheckboxCell,
  },
  {
    field: "status2",
    headerName: "Status 2",
    type: "number",
    width: 120,
    editable: true,
    renderEditCell: CheckboxCell,
    renderCell: CheckboxCell,
    align: "center",
  },
  {
    field: "status3",
    headerName: "Status 3",
    type: "number",
    width: 120,
    editable: true,
    renderEditCell: CheckboxCell,
    renderCell: CheckboxCell,
    align: "center",
  },
];

const initialRows: GridRowsProp = [
  {
    id: "DE",
    country: "DE",
    status1: 1,
    status2: 0,
    status3: 0,
  },
  {
    id: "UK",
    country: "UK",
    status1: 0,
    status2: 1,
    status3: 0,
  },
  {
    id: "ES",
    country: "ES",
    status1: 0,
    status2: 0,
    status3: 1,
  },
];

type OwnCell = {
  // Represents the row
  id: string;
  // Represents the column
  field: string;
};

const editableColumns = columns.filter(column => column.editable);
const allEditableCells: OwnCell[] = initialRows.reduce<OwnCell[]>(
  (prevAllCells, currentRow) => {
    for (const column of editableColumns) {
      prevAllCells.push({
        id: currentRow.id,
        field: column.field,
      });
    }
    return prevAllCells;
  },
  []
);

const Demo: React.FC<{}> = () => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [editRowsModel, setEditRowsModel] = React.useState({});
  const [rows, setRows] = React.useState<GridRowsProp>([]);

  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRows(initialRows);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleEditRowModelChange = React.useCallback(
    (params: GridEditRowModelParams) => {
      setEditRowsModel(params.model);
    },
    []
  );

  const handleEditClick = () => {
    if (!isEditing) {
      for (const cell of allEditableCells) {
        apiRef.current.setCellMode(cell.id, cell.field, "edit");
      }
      setIsEditing(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleCloseDialog = () => {
    for (const cell of allEditableCells) {
      apiRef.current.setCellMode(cell.id, cell.field, "view");
    }
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  const stopEventPropagation = React.useCallback(
    (params: GridCellParams, event: React.SyntheticEvent) => {
      event.stopPropagation();
    },
    []
  );

  return (
    <div>
      <XGrid
        apiRef={apiRef}
        loading={!rows.length}
        rows={rows}
        columns={columns}
        editRowsModel={editRowsModel}
        onEditRowModelChange={handleEditRowModelChange}
        autoHeight
        hideFooter={true}
        // Overriding the default behavior
        onCellBlur={stopEventPropagation}
        onCellKeyDown={stopEventPropagation}
        onCellClick={stopEventPropagation}
        onCellDoubleClick={stopEventPropagation}
      />

      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle>Changes</DialogTitle>
        <DialogContent>
          <code>{JSON.stringify(editRowsModel)}</code>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <br />
      <Button variant="outlined" onClick={handleEditClick}>
        {isEditing ? "Save" : "Edit"}
      </Button>
    </div>
  );
};

export default Demo;
