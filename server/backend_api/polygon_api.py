from polygon import RESTClient
from constants import POLYGON_API_KEY
from collections import defaultdict
from datetime import date, timedelta
from yahoo_fin import stock_info as si
import time
import pandas as pd

class PolygonData:


    #Add in real time refresh (might need paid version)
    def __init__(self,tickers, max_days) -> None:
        """Initialize the PolygonModel class."""
        self.client = RESTClient(api_key=POLYGON_API_KEY)
        self.tickers = tickers
        self.max_days = max_days
        self.data = self.build_backtest_data()



    def fetch_open_close(self,start_date,end_date,ticker):
        """
        Fetching open close data for a specific ticker and time span. Returns a dictionary, key is date and value is tuple open and close price. 
        """
        aggs = defaultdict(str)
        a = self.client.list_aggs(ticker=ticker, multiplier=1, timespan="day", from_=start_date, to=end_date, limit=50000)
        aggregated_data = list(a)
        num_days = len(aggregated_data)
        for delta in range(num_days):
            day_data = aggregated_data[delta]
            new_date = start_date + timedelta(days=delta)
            aggs[str(new_date)] = (day_data.open,day_data.close)
            #aggs[str(new_date)] = ((a['results'][delta]['o'],a['results'][delta]['c']))

        return aggs

    def build_backtest_data(self):
        """
        Build historical data for listed tickers, days
        """
        ticker_data = defaultdict(lambda: defaultdict(str))
        today = date.today()
        for ticker in self.tickers:
            ticker_data[ticker] = self.fetch_open_close(today-timedelta(days=self.max_days),today,ticker)
        
        return ticker_data
    




class Yahoo:
    def __init__(self, tickers, interval,duration = 24*60*60):
        self.tickers = tickers
        self.interval = interval
        self.data = pd.DataFrame(columns=['Ticker', 'Live Price', 'Timestamp'])
        self.max_duration = duration

    def fetch_live_price(self, ticker):
        """
        Fetch live stock data for the provided ticker.
        """
        try:
            live_price = si.get_live_price(ticker)
            return live_price
        except Exception as e:
            print(f"Error fetching live price for {ticker}: {e}")
            return None

    
    """
    def fetch_live_prices(self):
        while True:
            for ticker in self.tickers:
                live_price = si.get_live_price(ticker)
                timestamp = pd.Timestamp.now()
                self.data = self.data.append({'Ticker': ticker, 'Live Price': live_price, 'Timestamp': timestamp}, ignore_index=True)
            time.sleep(self.interval)

    """