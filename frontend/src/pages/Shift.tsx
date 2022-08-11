import React, { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import { getErrorMessage } from "../helper/error/index";
import { deleteShiftById, getShiftsByWeekRange } from "../helper/api/shift";
import DataTable from "react-data-table-component";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowBackIcon from "@material-ui/icons/ArrowLeft";
import ArrowNextIcon from "@material-ui/icons/ArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutlined';
import { getWeeklyRange, getWeeklyIntervalByWeekRange, FormatDatesToWeekRange } from "../helper/functions/weekInterval";
import { getPublishedWeek, publishWeek } from "../helper/api/week";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: 'white',
    color: theme.color.turquoise
  },
  weekRange:{
    margin:'0 10px', 
    alignSelf:'center'
  },
  weekRangePublished:{
    margin:'0 10px', 
    alignSelf:'center',
    color: theme.color.turqouise,
  },
  publishBtn: {
    backgroundColor: theme.color.turqouise,
    color: "white",
  },
  addShiftBtn:{
    color: theme.color.turqouise,
    borderColor: theme.color.turqouise
  },
  publishText:{
    color: theme.color.turqouise,
  }
}));

interface ActionButtonProps {
  id: string;
  onDelete: () => void;
}


const Shift = () => {
  const classes = useStyles();
  const history = useHistory();
  const initialWeeklyRange = getWeeklyRange();

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [weekRange, setWeekRange] = useState(initialWeeklyRange);
  const [publishedAt, setPublishedAt] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const onDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowDeleteConfirm(true);
  };

  const onCloseDeleteDialog = () => {
    setSelectedId(null);
    setShowDeleteConfirm(false);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        setErrMsg("");
        const weeklyInterval = getWeeklyIntervalByWeekRange(weekRange.firstRange,weekRange.lastRange);
        const { results } = await getShiftsByWeekRange(weeklyInterval);
        const week = await getPublishedWeek(weeklyInterval);
        if(week.results.length > 0 ) {
          setIsPublished(true);
          setPublishedAt(week.results[0].PublishedAt);
        }
        else{
          setIsPublished(false);
          setPublishedAt("");
        }
        setRows(results);
      } catch (error) {
        const message = getErrorMessage(error);
        setErrMsg(message);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [weekRange]);

  const ActionButton: FunctionComponent<ActionButtonProps> = ({
  id,
  onDelete,
  }) => {
  return (
    <div>
      <IconButton
        size="small"
        aria-label="delete"
        disabled={isPublished || rows.length === 0}
        component={RouterLink}
        to={`/shift/${id}/edit`}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" aria-label="delete" 
        disabled={isPublished || rows.length === 0}
        onClick={() => onDelete()} >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Date",
      selector: "date",
      sortable: true,
    },
    {
      name: "Start Time",
      selector: "startTime",
      sortable: true,
    },
    {
      name: "End Time",
      selector: "endTime",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <ActionButton id={row.id} onDelete={() => onDeleteClick(row.id)} />
      ),
    },
  ];

  const deleteDataById = async () => {
    try {
      setDeleteLoading(true);
      setErrMsg("");

      if (selectedId === null) {
        throw new Error("ID is null");
      }

      console.log(deleteDataById);

      await deleteShiftById(selectedId);

      const tempRows = [...rows];
      const idx = tempRows.findIndex((v: any) => v.id === selectedId);
      tempRows.splice(idx, 1);
      setRows(tempRows);
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setDeleteLoading(false);
      onCloseDeleteDialog();
    }
  };

  const handlePublish = async () => {
    try{
      setIsLoading(true);
      setErrMsg("");
      const formattedWeekRange = FormatDatesToWeekRange(weekRange.firstRange,weekRange.lastRange);
      const payload = {
        weekRange: formattedWeekRange,
        weekInterval: getWeeklyIntervalByWeekRange(weekRange.firstRange,weekRange.lastRange),
        publishedAt: new Date().toLocaleString('en-GB')
      };
      const data = await publishWeek(payload);
      if(data.statusCode === 200 ) {
        setIsPublished(true);
        setPublishedAt(payload.publishedAt);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      setErrMsg(message);
    } finally {
      setIsLoading(false);
    }
  }

  const WeeklyNavigation: FunctionComponent = () => {
    const handlePrev = () => {
      weekRange.firstRange.setDate(weekRange.firstRange.getDate() - 7);
      weekRange.lastRange.setDate(weekRange.lastRange.getDate() - 7);
      setWeekRange({
        firstRange: weekRange.firstRange,
        lastRange: weekRange.lastRange
      });
    }
    const handleNext = () => {
      weekRange.firstRange.setDate(weekRange.firstRange.getDate() + 7);
      weekRange.lastRange.setDate(weekRange.lastRange.getDate() + 7);
      setWeekRange({
        firstRange: weekRange.firstRange,
        lastRange: weekRange.lastRange
      });
    }
    return(
      <span style={{display:"flex"}}>
        <IconButton
          size="small"
          aria-label="back"
          onClick={() => handlePrev()}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>

        <h4 className={isPublished ? classes.weekRangePublished : classes.weekRange}>
          {FormatDatesToWeekRange(weekRange.firstRange, weekRange.lastRange)}
        </h4>
        <IconButton
          size="small"
          aria-label="next"
          onClick={() => handleNext()}
        >
          <ArrowNextIcon fontSize="small" />
        </IconButton>
      </span>
    );
  };

  const SchedudleActions : FunctionComponent = () => {
    return (
      <div style={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent:'space-between'}}>
          <WeeklyNavigation />
          <Box sx={{ display: 'flex'}}>
            <span style={isPublished ? { display:'flex'} : {display: 'none'}} >
                <CheckCircleIcon style={{marginRight: 0}} className={classes.weekRangePublished}  /> 
                <p style={{marginLeft: '5px'}} className={classes.weekRangePublished}>
                  Week published on { publishedAt }
                </p>
            </span>
            
            <Button style={{margin:'0 10px'}} variant="outlined" 
              onClick={() => history.push("/shift/add")}
              disabled={isPublished}
              className={classes.addShiftBtn}>
                Add Shift
            </Button>
            <Button variant="contained" 
              className={classes.publishBtn}
              onClick={handlePublish}
              disabled={isPublished || rows.length === 0}>
                Publish
            </Button>
          </Box>
        </Box>
      </div>
  )};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent>
            {errMsg.length > 0 ? (
              <Alert severity="error">{errMsg}</Alert>
            ) : (
              <></>
            )}
            <SchedudleActions />
            <DataTable
              columns={columns}
              data={rows}
              pagination
              progressPending={isLoading}
            />
          </CardContent>
        </Card>
      </Grid>
      <Fab
        size="medium"
        aria-label="add"
        className={classes.fab}
        onClick={() => history.push("/shift/add")}
      >
        <AddIcon />
      </Fab>
      <ConfirmDialog
        title="Delete Confirmation"
        description={`Do you want to delete this data ?`}
        onClose={onCloseDeleteDialog}
        open={showDeleteConfirm}
        onYes={deleteDataById}
        loading={deleteLoading}
      />
    </Grid>
  );
};

export default Shift;
