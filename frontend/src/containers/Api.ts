import axios from 'axios';

// Function to make a request to the server using Axios. By default GET request and pass any necessary req
const fetchData = async (endpoint: string, method: string = 'GET', data?: any) => {
    try {
        //const baseUrl: string = "https://api.thecatapi.com";  // for quick testing
        const baseUrl: string = "http://localhost:8000";  // change if deploying to prod url        
        const axiosConfig = {
            method, 
            url: baseUrl + endpoint,
            data,
        }

        const response = await axios(axiosConfig);
        console.log(response.data); // return the appropriate dat
        return response.data;
  } catch (error) {
        console.error('Error fetching data:', error);
  }
}

export default fetchData;