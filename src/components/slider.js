import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../config.json';
import RecentLogs from '../components/RecentLogs';
export default () => {
  const [value, setValue] = useState(500);
  const [time, setTime] = useState(6);
  const [interestRate, setinterestRate] = useState(0);
  const [monthlyPayment, setmonthlyPayment] = useState(0);
  const onClickHandler = val => {
    setTime(val.time);
    setValue(val.value);
    setinterestRate(val.interestRate);
    setmonthlyPayment(val.amount);
  };
  const apiCallHandler = () => {
    axios
      .get(url.replace('loanamount', value).replace('time', time))
      .then(res => {
        setinterestRate(res.data.interestRate);
        setmonthlyPayment(res.data.monthlyPayment.amount);
        let details = JSON.parse(localStorage.getItem('details'));

        details.push({
          value,
          time,
          interestRate: res.data.interestRate,
          amount: res.data.monthlyPayment.amount
        });
        console.log(details);
        localStorage.setItem('details', JSON.stringify(details));
      })
      .catch(err => console.log(err));
  };
  useEffect(() => {
    let localStore = JSON.parse(localStorage.getItem('initialLoan'));
    localStorage.setItem('details', JSON.stringify([]));
    function setValues() {
      setValue(localStore.value);
      setTime(localStore.time);
      setinterestRate(localStore.interestRate);
      setmonthlyPayment(localStore.amount);
    }

    !localStore
      ? axios
          .get(url.replace('loanamount', value).replace('time', time))
          .then(res => {
            localStorage.setItem(
              'initialLoan',
              JSON.stringify({
                value,
                time,
                interestRate: res.data.interestRate,
                amount: res.data.monthlyPayment.amount
              })
            );
            setinterestRate(res.data.interestRate);
            setmonthlyPayment(res.data.monthlyPayment.amount);
          })
          .catch(err => console.log(err))
      : setValues();
  }, []);
  return (
    <>
      <p>{interestRate}</p>
      <p>{monthlyPayment}</p>
      <input
        type='range'
        min='500'
        max='5000'
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={() => apiCallHandler()}
      />
      <input
        type='range'
        min='6'
        max='24'
        value={time}
        onChange={e => setTime(e.target.value)}
        onBlur={() => apiCallHandler()}
      />
      <RecentLogs onClickHandler={onClickHandler} />
    </>
  );
};
