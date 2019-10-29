import React from 'react';

export default props => {
  let { onClickHandler, logs } = props;

  return (
    <>
      <h3>Recent Logs</h3>
      {logs.map(val => (
        <div
          className='logsborder'
          onClick={() => {
            onClickHandler(val);
          }}
          key={val.id}
        >
          <p>Value:{val.value}</p>
          <p>Time:{val.time}</p>
        </div>
      ))}
    </>
  );
};
