import React, {useState, useRef} from 'react';
import axios from 'axios';
import {connect} from 'react-redux'
import {reset} from 'redux-form';
import DishForm from './components/DishForm';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App(props) {

  const [resData,setResData] = useState(false);
  const dishFormRef = useRef(null);

  function getDish() {
    axios.post('https://frosty-wood-6558.getsandbox.com:443/dishes',props.form.dishForm.values)
      .then((result) => {
        console.log(result.data);
        ////props.dishFetched({});
        setResData({data:result.data, error:false});
        props.resetForm();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setResData({data:false, error:error.request});
      });

  }

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div>
          <DishForm ref={dishFormRef} onSubmit={getDish} />
          <div>
            {
              resData.data ? 
              <div className="res-data"> 
                <h2>Response data:</h2>
                {
                  Object.keys(resData.data).map(function(key,i) {
                    return(
                    <div key={resData.data[key]+i}>
                       <span>{key+": "}</span><span>{resData.data[key]}</span>
                     </div>
                     );
                  })
                }
              </div> 
              : resData.error ? <h2>Response error status {resData.error.status}</h2> : null
            }
          </div>
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    form: state.form
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetForm: () => dispatch(reset("dishForm"))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
