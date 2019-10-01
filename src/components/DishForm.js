import React, {useState} from 'react';
import { Field, reduxForm } from 'redux-form'

import BaseSelect from 'react-select';
import FixRequiredSelect from "../components/FixRequiredSelect";

const options = [
  { value: 'pizza', label: 'Pizza' },
  { value: 'soup', label: 'Soup' },
  { value: 'sandwich', label: 'Sandwich' },
];

const Select = props =>{ 
  return(
  <FixRequiredSelect
    {...props.input}
    placeholder={props.input.value}
    required={props.required}
    SelectComponent={BaseSelect}
    onChange={(value,config) => {props.selectChange(value,config); (value => props.input.onChange(value.value))(value)}} 
    onBlur={() => props.input.onBlur(props.input.value)} 
    options={props.options || options}
  />
)};

const regex = RegExp('(0[0-9]|1[0-9]|2[0-3])(\:)(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])(\:)(0[0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])'); 
function checkDatee(value){
  if (regex.test(value)) {
    return undefined;
  }
  return "Time must have more seconds than 0";
}

const warnField = ({ input, label, type, step, className, meta: { touched, error, warning } }) => (
  <>
      <input {...input} className={className} placeholder={label} type={type} step={step}/>
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
  </>
)

let DishForm = props => {

  const [values,setValues] = useState({});

  function selectChange(item,config){
    let newValues = {...values};
    newValues[config.name] = item.value ;
    setValues(newValues);
  }

  function normalizeNumber(value){
    let nbValue = Number(value);
    if(Number.isInteger(nbValue)){
      nbValue = Number.parseInt(nbValue);
    }else {
      nbValue = Number.parseFloat(nbValue);
    }
    return nbValue;
  }



  const getByType = (type) => {
    
    switch (type) {
      case 'pizza':
        return(
          <>
            <label>Number of slices</label>
            <Field component="input" className="form-control" type="number" name="no_of_slices" normalize={normalizeNumber} required/>
            <label>Diameter</label>
            <Field component="input" className="form-control" type="number" step="0.01" name="diameter" normalize={normalizeNumber} required/>
          </> 
        )
      case 'soup':
        return(
          <>
            <label>Spiciness scale</label>
            <Field component="input" className="form-control" type="range" min="0" max="10" name="spiciness_scale" normalize={normalizeNumber} required/>
          </> 
        )  
      case 'sandwich':
        return(
          <>
            <label>Number of slices of bread</label>
            <Field component="input" className="form-control" type="number" name="slices_of_bread" normalize={normalizeNumber} required/>
          </> 
        )
      default: return null; 
    }
  }

  const { handleSubmit } = props;

  return(
    <div>
          <form onSubmit={handleSubmit}>
              <label>Dish name</label>
              <Field component="input" className="form-control" type="text" name="name" required/>
              <label>Preparation time</label>
              <Field component={warnField} className="form-control" type="time" name="preparation_time" step="1" validate={checkDatee} required/>
              <label>Dish type</label>
              <Field  name="type" component={Select} options={options} isSearchable={false}  selectChange={(v,c) => selectChange(v,c)} required={true}/>
              <div>
                {getByType(values.type)}
              </div>
              <button className="btn btn-primary mb-2" type="submit">submit</button>
            </form>
    </div>
  )
}

DishForm = reduxForm({
  // a unique name for the form
  form: 'dishForm'
})(DishForm);

export default DishForm;
