import React, { useState } from 'react'
import './FormStyles.scss';
import { Formik, Form, Field } from 'formik';
import {default as datepicker} from "react-multi-date-picker";

import {
  Button,
  LinearProgress,
  MenuItem,
} from '@material-ui/core';

import "react-multi-date-picker/styles/layouts/mobile.css";
import { DatePanel } from "react-multi-date-picker/plugins";
import {TextField} from 'formik-material-ui'; 


import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import AreaData from './AreaData';
import SubscsiiptionType from './SubscriptionType';
import Product from './Product';
import image from '../../images/green-3.svg';



const Form_sheet = () => {
  const today = new Date()
  const tomorrow = new Date()

  tomorrow.setDate(tomorrow.getDate() + 1)


  const [subscription_type, set_subscription_type] = useState('')
  const [specific_dates, setspecificdates] = useState([today,tomorrow])
  const [date_range,setdaterange]=useState([today,tomorrow])
  const [date,setDate]=useState()


  function isDate(val) {
    // Cross realm comptatible
    return Object.prototype.toString.call(val) === '[object Date]'
  }

  function isObj(val) {
    return typeof val === 'object'
  }

  function stringifyValue(val) {
    if (isObj(val) && !isDate(val)) {
      return JSON.stringify(val)
    } else {
      return val
    }
  }

  function buildForm({ action, params }) {
    const form = document.createElement('form')
    form.setAttribute('method', 'post')
    form.setAttribute('action', action)

    Object.keys(params).forEach(key => {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', key)
      input.setAttribute('value', stringifyValue(params[key]))
      form.appendChild(input)
    })

    return form
  }

  function post(details) {
    const form = buildForm(details)
    document.body.appendChild(form)
    form.submit()
    form.remove()
  }

  const getData = (data) => {

    return fetch(`/api/payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => response.json()).catch(err => console.log(err))
  }


  return (
    <div className='form'>

      <div className='form-head'>

        <h2 className='form-head-primary'> START WITH OUR SUBSCRIPTION </h2>
        <img className='form-head-image' src={image} alt='image'></img>
        <h3 className='form-head-secondary'>
          Subscribe with us to get farm fresh organic batter on a regular basis, delivered at your doorsteps.
      </h3>

      </div>

      <Formik
        initialValues={{
          user_name: '',
          email: '',
          password: '',
          confirm_password: '',
          mobile_number: '',
          address: '',
          door_number: '',
          street_name_or_apartment_name: '',
          landmark: '',
          area: '',
          start_date: new Date(),
          end_date: new Date(),
          Date_Range:'',
          Specific_Dates: '',
          subscription_type: '',
          product: ''
        }}
        validate={(values) => {
          const errors = {};
          //validation for name field
          if (!values.user_name) {
            errors.user_name = 'Name required'
          }
          //validation for email
          if (!values.email) {
            errors.email = 'Email Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = 'Invalid Email Address';
          }

          //validation for passwords

          if (!values.password) {
            errors.password = 'Password Required'
          }
          else if (values.password.length < 8) {
            errors.password = 'Password should contain at least 8 characters.'
          }

          //validation checking whether password and confirm password match
          if (!values.confirm_password) {
            errors.confirm_password = 'Password Required'
          }

          else if (values.password != values.confirm_password) {
            errors.confirm_password = "Password does'nt match"
          }

          //validation for mobile-number
          if (!values.mobile_number) {
            errors.mobile_number = 'Mobile number required'
          }
          else if (values.mobile_number.toString().length != 10) {
            errors.mobile_number = 'invalid Mobile number'
          }

          //validation for address
          if (!values.address) {
            errors.address = 'Address Required'
          }
          //validation for area
          if (!values.area) {
            errors.area = 'Select Your Location'
          }

          if (!values.subscription_type) {
            errors.subscription_type = 'Select your subcription type'
          }
          if (!values.product) {
            errors.product = 'Select product'
          }
          if (!values.door_number) {
            errors.door_number = 'Door number required'
          }
          if (!values.street_name_or_apartment_name) {
            errors.street_name_or_apartment_name = 'Street name/Apartment name required'
          }
           
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            setSubmitting(false);
            getData({
              "user_name": values.user_name.toString(),
              "amount": '2400',
              "mobile_number": values.mobile_number.toString(),
              "email": values.email.toString()
            }).then(response => {

              var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
              }
              post(information)

            })
           
            // make use of specific dates if specific dates is selected else use dates_range in backend
            values={
              ...values,
              Specific_Dates:specific_dates,
              Date_Range:date_range
            }

            alert(JSON.stringify(values, null, 2));
          }, 500);
        }}
      >
        {({ submitForm, isSubmitting, touched, errors }) => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>

            <Form className='form-box'>
              <div className='form-box-col1'>
              

                <Field className='field'
                  component={TextField}
                  type="text"
                  label="Your Name"
                  name="user_name"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  type="password"
                  label="Password"
                  name="password"
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  type="email"
                  label="Your email"
                  name="email"
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  multiline
                  rowsMax={3}
                  name="address"
                  type="text"
                  label="Address"
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  name="door_number"
                  type="text"
                  label="Door Number"
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  name="street_name_or_apartment_name"
                  type="text"
                  label="Street name/Apartment name"
                  inputProps={{ style: { fontSize: 20 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field
                  component={TextField}
                  type="text"
                  name="area"
                  className='field'
                  label="Area"
                  select
                  variant="standard"
                  helperText="Please select Area"
                  margin="normal"
                  inputProps={{ style: { fontSize: 20 } }} // font size of input text
                  InputLabelProps={{ style: { fontSize: 20 } }} // font size of input label
                >
                  {AreaData.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Field>
                <Field
                  component={TextField}
                  className='field'
                  type="text"
                  name="product"
                  label="Products"
                  select
                  variant="standard"
                  helperText="Select Product"
                  margin="normal"
                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 22 } }}
                >
                  {Product.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}
                </Field>
              </div>
              {isSubmitting && <LinearProgress />}

              <div className='form-box-col2'>


                <Field className='field'
                  component={TextField}
                  name="mobile_number"
                  type="number"
                  label="Mobile Number"
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  type="password"
                  label="Confirm Password"
                  name="confirm_password"
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  name="landmark"
                  type="text"
                  label="Landmark(Optional)"
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field className='field'
                  component={TextField}
                  name="City"
                  disabled
                  type="text"
                  label="Chennai"
                  helperText='Select your city'
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 20 } }}
                />

                <Field
                  component={TextField}
                  type="text"
                  className='field'
                  name="subscription_type"
                  label="Subscription Type"
                  select
                  variant="standard"
                  margin="normal"

                  inputProps={{ style: { fontSize: 25 } }}
                  InputLabelProps={{ style: { fontSize: 22 } }}
                  onClick={(e) => (set_subscription_type(e.target.value))}
                >
                  {SubscsiiptionType.map((data, index) => (
                    <MenuItem key={index} value={data}>
                      {data}
                    </MenuItem>
                  ))}


                </Field>

                {subscription_type !== 'Only On Specified Days' ?
              <div className="datepicker">
                  <p className="datepicker-helpertext">Select Start date &#38; End Dates</p>
                  <Field
                  component={datepicker}
                  range
                  value={date_range}
                  onChange={setdaterange}
                  className="rmdp-mobile"
                  inputClass='datepicker-button'
                  type="button"
                  minDate={new Date}
                  plugins={[
                    <DatePanel />
                  ]}/>
                  </div>
                  :
                  <div className="datepicker">
                  <p className="datepicker-helpertext">Select Specific Dates</p>
                  <Field
                  component={datepicker}
                  multiple
                  value={specific_dates}
                  onChange={setspecificdates}
                  className="rmdp-mobile"
                  inputClass='datepicker-button'
                  type="button"
                  minDate={new Date}
                  plugins={[
                    <DatePanel />
                  ]}/>
                  </div>
                }
                {console.log(date_range)}
                {console.log(specific_dates)}
                
                <Button
                  className={['field','button'].join('')}
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={submitForm}
                  inputProps={{ style: { fontSize: 22 } }}
                  InputLabelProps={{ style: { fontSize: 22 } }}
                >
                  Subscribe
            </Button>

              </div>
            </Form>

          </MuiPickersUtilsProvider>
        )}
      </Formik>
    </div>
  );


}

export default Form_sheet;