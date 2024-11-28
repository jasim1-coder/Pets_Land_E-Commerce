import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import "./PieChart.css"
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);


function PieChart() {

    const [allProduct,setAllProduct] = useState([])
    const [categoryCounts, setCategoryCounts] = useState({ dog: 0, cat: 0 });

    useEffect(() => {
        const fetchData = async () => {
        try{
           const response = await axios.get('http://localhost:3000/product')
                setAllProduct(response.data)
        }
            catch(error){
                console.error('There was an error fetching the products!', error);
            };
        };
            fetchData()
        },[]);

        const calculateCategoryCounts = () => {
            const counts = allProduct.reduce((acc, product) => {
              if (product.category === 'dog') {
                acc.dog += 1;
              } else if (product.category === 'cat') {
                acc.cat += 1;
              }
              return acc;
            }, { dog: 0, cat: 0 });
        
            setCategoryCounts(counts); 
          };

          useEffect(() => {
            if (allProduct.length > 0) {
              calculateCategoryCounts();
            }
          }, [allProduct]); 

          const pieChartData = {
            labels: ['Dog', 'Cat'], // Category labels
            datasets: [
              {
                data: [categoryCounts.dog, categoryCounts.cat], // Category counts
                backgroundColor: ['#FF6384', '#36A2EB'], // Colors for the chart
                hoverBackgroundColor: ['#FF6384', '#36A2EB'],
              },
            ],
          };
    
  return (
    <div className="pie-chart-container" style={{ width: '50%', height: '500px' }}>
    <h2>Product Categories Distribution</h2>
    <Pie data={pieChartData} /> </div>  )
}

export default PieChart