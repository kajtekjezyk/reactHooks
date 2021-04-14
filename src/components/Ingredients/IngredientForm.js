import React, {useState} from 'react';
import LoadingIndicator from '../UI/LoadingIndicator';


import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [title, modifyTitle] = useState('');
  const [amount, modifyAmount] = useState('');
  const submitHandler = event => {
    event.preventDefault();
    props.clicked({title: title, amount: amount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={title} onChange={(event) => modifyTitle(event.target.value)}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount"  value={amount} onChange={(event) => modifyAmount(event.target.value)}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;