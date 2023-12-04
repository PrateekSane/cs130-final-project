export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface CreateGameValues {
  startingBalance: number;
  duration: string;

}
export interface JoinGameValues {
  game_id: string

}

export interface InteractWithHoldingValues {
  symbol: string,
  game_id: string | null,
  shares: string

}

export type AuthContextValue = {
  user: any; // Change 'any' to the actual type of your user
  login: (data: any) => void; // Change 'any' to the data type expected for login
  logout: () => void;
};
