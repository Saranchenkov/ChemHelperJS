import React, {Component} from 'react';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid/main-with-styles';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import PlusOne from 'material-ui-icons/PlusOne';
import Forward from 'material-ui-icons/ArrowForward';
import Back from 'material-ui-icons/ArrowBack';
import { reduxForm, getFormValues} from 'redux-form';
import {connect} from 'react-redux';
import Select from 'material-ui/Select';
import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import {ReduxForms, Units} from "../../utils/utils";
import NumberFormat from 'react-number-format';
import {optionsCellStyle} from "../Yield/Yield";
import numeral from 'numeral';
import RemoveRowRenderer from '../../utils/cellRenderers/RemoveRowRenderer';

const cellStyle = {
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    border: 'none'
};

const DensityFormat = ({ inputRef, onChange, ...other }) => {
    return (
        <NumberFormat
            {...other}
            ref={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            suffix=" g/ml"
            allowNegative={false}
        />
    );
};

const numberParser = params => Number(params.newValue);

export const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});


class FinalTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.finalData,
            solutionDensity: props.solutionDensity,
            radYield: props.radYield,
            unit: props.unit
        };
        this.gridOptions = {
            columnDefs: [
                { unSortIcon: true, headerName: '№', field: 'id', width: 25, cellStyle: cellStyle, suppressFilter: true },
                { unSortIcon: true,
                    headerName: 'Time, min',
                    field: 'time',
                    editable: true,
                    width: 40,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { unSortIcon: true,
                    headerName: 'Optical Dencity',
                    field: 'dencity',
                    editable: true,
                    width: 50,
                    cellStyle: cellStyle,
                    valueParser: numberParser
                },
                { unSortIcon: true,
                    headerName: 'Concentration, M',
                    field: 'concentration',
                    editable: true,
                    width: 60,
                    cellStyle: cellStyle,
                    valueParser: numberParser,
                    valueFormatter: params => {
                        if (Number.isNaN(params.value)) {
                            return params.value;
                        } else {
                            return numeral(params.value).format('0.00000e+0');
                        }
                    }
                },
                { checkboxSelection: true, width: 30, headerName: 'On/Off', cellStyle: cellStyle},
                { width: 20, cellRendererFramework: RemoveRowRenderer, cellStyle: optionsCellStyle, cellClass: 'no-border'}
            ],
            icons: {
                sortAscending: '<i class="fa fa-sort-asc" style="color: black" />',
                sortDescending: '<i class="fa fa-sort-desc" style="color: black"/>',
                sortUnSort: '<i class="fa fa-sort" style="color: gray"/>',
            },
            enableSorting: true,
            enableColResize: true,
            singleClickEdit: true,
            stopEditingWhenGridLosesFocus: true,
            enterMovesDownAfterEdit: true,
            suppressRowClickSelection: true,
            rowSelection: 'multiple',
            onRowDataChanged: ({api}) => {
                api.forEachNode(node => {
                    if (node.data.isSelected) {
                        node.setSelected(true);
                    }
                });
            }
        };
    }

    onGridReady = params => {
        this.gridApi = params.api;
        this.columnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();
    };

    addRow = () => {
        let newRow = {
            id: this.state.data.length + 1,
            concentration: 0.0,
            dencity: 0.0,
            time: 0.0,
            isSelected: true
        };
        let data = [...this.getRowData(), newRow];
        this.setState({data});
        this.gridApi.setRowData(data);
    };

    getRowData = () => {
        let array = [];
        this.gridApi.forEachNode(node => array.push({...node.data, isSelected: node.selected}));
        return array;
    };

    selectData = () => {
        this.gridApi.forEachNode(node => {
            if (node.data.isSelected) {
                node.setSelected(true);
            }
        });
    };

    calculateConcentrations = () => {
        let func = this.props.trendFunc;
        let data = this.getRowData();
        data.forEach(point => { point.concentration = func(point.dencity); });
        this.gridApi.setRowData(data);
        this.selectData();
    };

    getTableHeight = dataLength => 45 + dataLength * 26;

    nextPage = () => {
        let {unit, radYield, solutionDensity} = this.state;
        this.props.change('finalData', this.getRowData());
        this.props.change('unit', unit);
        this.props.change('radYield', radYield);
        this.props.change('solutionDensity', solutionDensity);
        this.props.nextPage();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    RadYieldFormat = ({ inputRef, onChange, ...other }) => {
        return (
            <NumberFormat
                {...other}
                ref={inputRef}
                onValueChange={values => {
                    onChange({
                        target: {
                            value: values.value,
                        },
                    });
                }}
                suffix={` ${this.state.unit}`}
                thousandSeparator
                allowNegative={false}
            />
        );
    };

    render() {
        let containerStyle = {
            height: this.getTableHeight(this.state.data.length),
            width: 650,
            align: 'center'
        };
        let { classes } = this.props;
        return (
            <div>
                <h3 className="my-3 text-center">Dose rate calculation</h3>
                <h5 className="text-center">Final table</h5>
                <div className='d-flex flex-row justify-content-center'>
                    <div style={containerStyle} className="ag-theme-fresh">
                        <AgGridReact
                            rowData={this.state.data}
                            onGridReady={this.onGridReady}
                            gridOptions={this.gridOptions}
                        />
                        <div className='d-flex flex-row justify-content-between'>
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.calculateConcentrations}>
                                Calculate concentrations
                            </Button>
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.addRow}>
                                <PlusOne className={classes.leftIcon} />
                                Row
                            </Button>
                            <Button className={classes.button} variant="raised" color="secondary" onClick={this.props.previousPage}>
                                <Back className={classes.leftIcon} />
                                Back
                            </Button>
                            <Button className={classes.button} variant="raised" color="primary"
                                    onClick={this.nextPage}
                                    disabled={!this.state.radYield || !this.state.solutionDensity}
                            >
                                Next
                                <Forward className={classes.rightIcon} />
                            </Button>
                        </div>
                        <div>
                            <h3 className="my-3 text-center">Enter parameters for calculating dose rate:</h3>
                            <div className='d-table' style={{fontSize: 16}}>
                                <div className='d-table-row my-2'>
                                    <div className='d-table-cell' style={{width: 180}}>
                                        Solution dencity &rho; :
                                    </div>
                                    <div className='d-table-cell'>
                                        <Input value={this.state.solutionDensity}
                                               onChange={this.handleChange('solutionDensity')}
                                               inputComponent={DensityFormat}
                                        />
                                    </div>
                                </div>
                                <div className='d-table-row my-2'>
                                    <div className='d-table-cell'>Yield G :</div>
                                    <div className='d-table-cell'>
                                        <Input value={this.state.radYield}
                                               onChange={this.handleChange('radYield')}
                                               unit={this.state.unit}
                                               inputComponent={this.RadYieldFormat}
                                        />
                                    </div>
                                </div>
                                <div className='d-table-row my-2'>
                                    <div className='d-table-cell'>Unit of measure of yield:</div>
                                    <div className='d-table-cell'>
                                        <Select value={this.state.unit} onChange={this.handleChange('unit')}>
                                            <MenuItem value={Units.moleculesPerHundredVolt}>{Units.moleculesPerHundredVolt}</MenuItem>
                                            <MenuItem value={Units.molPerJoule}>{Units.molPerJoule}</MenuItem>
                                        </Select>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

FinalTable = connect(
    state => ({
        trendFunc: getFormValues(ReduxForms.DoseRate)(state).trendFunc,
        finalData: getFormValues(ReduxForms.DoseRate)(state).finalData,
        radYield: getFormValues(ReduxForms.DoseRate)(state).radYield,
        solutionDensity: getFormValues(ReduxForms.DoseRate)(state).solutionDensity,
        unit: getFormValues(ReduxForms.DoseRate)(state).unit
    })
)(FinalTable);

export default reduxForm({
    form: ReduxForms.DoseRate, // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
})(withStyles(styles)(FinalTable));
