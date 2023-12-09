from polygon import RESTClient
# from constants import POLYGON_API_KEY
from collections import defaultdict
from datetime import date, timedelta
from yahoo_fin import stock_info as si
import time
import pandas as pd

class PolygonData():


    #Add in real time refresh (might need paid version)
    def __init__(self,tickers, max_days) -> None:
        """
        Initializes our object to fetch historical data from the Polygon API. 
        
        Parameters
        ----------
        first : tickers
            List of tickers we want to track. 
        second : max_days
            Int. Maximum number of days to track back historically

        Returns
        -------

        N/A

        Raises
        ------
        N/A
        """
        self.client = RESTClient(api_key=POLYGON_API_KEY)
        self.tickers = tickers
        self.max_days = max_days
        self.data = self.build_backtest_data()



    def fetch_open_close(self,start_date,end_date,ticker):
        """
        Fetching open close data for a specific ticker and time span. 

        Parameters
        ----------
        first : start_date
            Datetime Object. Start date for data to fetch. 
        second : end_date
            Datetime Object. End date for data to fetch. 
        third : ticker
            String. Ticker to fetch data for. 

        Returns
        -------

        Dictionary. Key date and value is a tuple with the open and close price for that ticker for that date. 

        Raises
        ------
        N/A
        """
        aggs = defaultdict(str)
        a = self.client.list_aggs(ticker=ticker, multiplier=1, timespan="day", from_=start_date, to=end_date, limit=50000)
        aggregated_data = list(a)
        num_days = len(aggregated_data)
        for delta in range(num_days):
            day_data = aggregated_data[delta]
            new_date = start_date + timedelta(days=delta)
            aggs[str(new_date)] = (day_data.open,day_data.close)

        return aggs

    def build_backtest_data(self):
        """
        Build full historical data suite for listed tickers, days. Calls fetch_open_close.

        
        Parameters
        ----------
        N/A

        Returns
        -------

        Dictionary. Key ticker and value is the dictionary returned by fetch_open_close. 

        Raises
        ------
        N/A
        """
        ticker_data = defaultdict(lambda: defaultdict(str))
        today = date.today()
        for ticker in self.tickers:
            ticker_data[ticker] = self.fetch_open_close(today-timedelta(days=self.max_days),today,ticker)
        
        return ticker_data
    




class Yahoo:
    def __init__(self, tickers, interval,duration = 24*60*60):

        """
        Initializes our object to fetch live ticker data from the Yahoo Finance API. 
        
        Parameters
        ----------
        first : tickers
            List. Tickers we want to track. 
        second : interval
            Int. How often to fetch data when automating process. 
        third : duration
            Int. How long to fetch live data for if automated, in seconds. Default is 1 day. 

        Returns
        -------

        N/A

        Raises
        ------
        N/A
        """
        self.tickers = tickers
        self.interval = interval
        self.data = pd.DataFrame(columns=['Ticker', 'Live Price', 'Timestamp'])
        self.max_duration = duration


    
    
    def fetch_live_ticker(self,ticker):
        """
        Fetch live stock data for provided ticker. 

        Parameters
        ----------
        first : ticker
            String. Ticker to fetch live price for. 
        
        Returns
        -------

        Int. Price for ticker. 

        Raises
        ------
        N/A
        """
        return si.get_live_price(ticker)
    
    
    def fetch_live_prices(self):
        """
        Fetch live stock data all tickers in object. Store in self.data object. 

        Parameters
        ----------
        N/A
        
        Returns
        -------

        N/A

        Raises
        ------
        N/A
        """
        while True:
            for ticker in self.tickers:
                live_price = si.get_live_price(ticker)
                timestamp = pd.Timestamp.now()
                self.data = self.data.append({'Ticker': ticker, 'Live Price': live_price, 'Timestamp': timestamp}, ignore_index=True)
            time.sleep(self.interval)


