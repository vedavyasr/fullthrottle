import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../config.json';
import RecentLogs from '../components/RecentLogs';

export default () => {
  const [value, setValue] = useState(500);
  const [time, setTime] = useState(6);
  const [interestRate, setinterestRate] = useState(0);
  const [monthlyPayment, setmonthlyPayment] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loader, setLoader] = useState(false);

  //function to trigger on click of each recent log
  const onClickHandler = val => {
    setTime(val.time);
    setValue(val.value);
    setinterestRate(val.interestRate);
    setmonthlyPayment(val.amount);
  };
  //function for api calls on blur
  const apiCallHandler = () => {
    setLoader(true);
    axios
      .get(url.replace('loanamount', value).replace('time', time))
      .then(res => {
        setLoader(false);
        setinterestRate(res.data.interestRate);
        setmonthlyPayment(res.data.monthlyPayment.amount);
        let details = JSON.parse(localStorage.getItem('details'));
        details.push({
          id: details.length,
          value,
          time,
          interestRate: res.data.interestRate,
          amount: res.data.monthlyPayment.amount
        });
        setLogs(details);
        localStorage.setItem('details', JSON.stringify(details)); //saving to localstorage
      })
      .catch(err => setLoader(false));
  };
  //works only on inital render --- similar to componentDidMount
  useEffect(() => {
    let localStore = JSON.parse(localStorage.getItem('initialLoan'));
    !localStorage.getItem('details')
      ? localStorage.setItem('details', JSON.stringify([]))
      : setLogs(JSON.parse(localStorage.getItem('details')));
    function setValues() {
      setValue(localStore.value);
      setTime(localStore.time);
      setinterestRate(localStore.interestRate);
      setmonthlyPayment(localStore.amount);
    }
    //makes an api call if doesnot have intial values response
    !localStore
      ? axios
          .get(url.replace('loanamount', value).replace('time', time))
          .then(res => {
            setLoader(false);
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
          .catch(err => setLoader(false))
      : setValues();
  }, []);

  return (
    <div className='flex'>
      <div style={{ flex: '60%' }}>
        <p>
          <strong>Interest Rate: {interestRate}</strong>
        </p>
        <p>
          <strong>Monthly payment: {monthlyPayment}</strong>
        </p>
        {!loader ? (
          <div>
            <div>
              <div> Change Amount: {value} </div>
              <input
                type='range'
                min='500'
                max='5000'
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={() => apiCallHandler()}
              />
            </div>
            <div>
              <div> Change Time: {time} </div>
              <input
                type='range'
                min='6'
                max='24'
                value={time}
                onChange={e => setTime(e.target.value)}
                onBlur={() => apiCallHandler()}
              />
            </div>
          </div>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
      <div style={{ flex: '40%' }}>
        <RecentLogs logs={logs} onClickHandler={onClickHandler} />
      </div>
    </div>
  );
};
