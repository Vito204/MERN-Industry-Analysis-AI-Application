import axios from "axios";

//Register
export const registerAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/register",
    {
      username: userData?.username,
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//Login
export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//Check Auth
export const checkUserAuthStatusAPI = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/users/auth/check",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//Logout
export const logoutAPI = async () => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//User profile
export const getUserProfileAPI = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/v1/users/profile",

    {
      withCredentials: true,
    }
  );
  return response?.data;
};
