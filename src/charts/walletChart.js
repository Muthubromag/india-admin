import React from 'react';
import { Line } from 'react-chartjs-2';

const WalletDepositsChart = () => {
  const data = {
    labels: ['12-12-2023', '13-12-2023', '14-12-2023', '15-12-2023','16-12-2023'],
    datasets: [
      {
        label: 'Wallet Deposits',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#fff',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [10000, 70000, 30000, 50000,20000],
          pointLabels: {
          color: 'white', 
        },
      },
    ],
  };

  const chartContainerStyle = {
    width: '300px', 
  };

  

  return (
    <div style={chartContainerStyle}>
      <Line data={data} className='!text-white'/>
    </div>
  );
};

export default WalletDepositsChart;
