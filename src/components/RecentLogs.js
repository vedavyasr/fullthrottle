import React from 'react';

export default props => {
  let { onClickHandler } = props;
  const details = JSON.parse(localStorage.getItem('details'));
  return details.map(val => {
    return (
      <div
        style={{ border: '1px solid black' }}
        onClick={() => {
          onClickHandler(val);
        }}
      >
        <p>Value:{val.value}</p>
        <p>Time:{val.time}</p>
      </div>
    );
  });
};
