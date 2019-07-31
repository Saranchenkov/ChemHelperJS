import React from 'react';
import Input from '@material-ui/core/Input';
import { FormControl, FormHelperText } from '@material-ui/core/Form';
import PropTypes from 'prop-types';

const ControlledNumberInput = ({ id, value, onChange, error }) => (
    <FormControl error={Boolean(error)} aria-describedby={id}>
        <Input type={'number'} value={value} onChange={onChange} />
        <FormHelperText id={id}>{error}</FormHelperText>
    </FormControl>
);

ControlledNumberInput.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
       PropTypes.number,
       PropTypes.string
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default ControlledNumberInput;