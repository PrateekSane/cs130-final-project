import axios from "axios";
import Cookies from "js-cookie";

interface CustomHeaders {
  "Content-Type": string;
  "X-CSRFToken"?: string;
}

// Function to make a request to the server using Axios. By default GET request and pass any necessary req
const fetchData = async (
  endpoint: string,
  method: string = "GET",
  data?: any,
  addCsrf: boolean = false
) => {
  try {
    //const baseUrl: string = "https://api.thecatapi.com";  // for quick testing
    const baseUrl: string = "http://localhost:8000/"; // change if deploying to prod url
    const headers: CustomHeaders = {
      "Content-Type": "application/json",
    };

    if (addCsrf) {
      headers["X-CSRFToken"] = Cookies.get('csrftoken');
    }

    const axiosConfig = {
      method,
      url: baseUrl + endpoint,
      data,
      headers: headers as any,
      withCredentials: addCsrf,
    };
    console.log(axiosConfig);
    const response = await axios(axiosConfig);
    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export default fetchData;
