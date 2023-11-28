export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
<<<<<<< HEAD
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
=======
    email: string,
    username: string,
    firstName: string
    lastName: string,
    password: string,
>>>>>>> 462182b (stuff)
}

export type AuthContextValue = {
  user: any; // Change 'any' to the actual type of your user
  login: (data: any) => void; // Change 'any' to the data type expected for login
  logout: () => void;
};
