import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLogin } from "../../hooks";
import { login } from "../../redux/slices/userSlice";
const LoginComponent: React.FC<{
  setLoginPage: any;
  setSignup: any;
}> = ({ setLoginPage, setSignup }) => {
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!email || !password) return setError("Please complete all fields");
      useLogin(
        { email, password },
        setError,
        login,
        dispatch,
        setLoginPage,
        setLoading
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <p
        tabIndex={0}
        role='heading'
        aria-label='Login to your account'
        className='text-2xl font-extrabold leading-6 text-gray-800'
      >
        Login to your account
      </p>
      <p className='text-sm mt-4 font-medium leading-none text-gray-500'>
        Dont have account?{" "}
        <span
          tabIndex={0}
          role='link'
          aria-label='Sign up here'
          className='text-sm font-medium leading-none underline text-gray-800 cursor-pointer'
          onClick={() => {
            setSignup("signup");
          }}
        >
          {" "}
          Sign up here
        </span>
      </p>

      <div>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Email
        </label>
        <input
          aria-label='enter email adress'
          role='input'
          type='email'
          className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
          placeholder='Email'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setError("");
          }}
          value={email}
        />
      </div>
      <div className='mt-6  w-full'>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Password
        </label>
        <div className='relative flex items-center justify-center'>
          <input
            aria-label='enter Password'
            role='input'
            type={passwordShow ? "text" : "password"}
            className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
            placeholder='Enter password'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setError("");
            }}
            value={password}
          />
          <div className='absolute right-0 mt-2 mr-3 cursor-pointer'>
            {passwordShow ? (
              <i
                className='fa-regular fa-eye'
                onClick={() => setPasswordShow((cur) => !cur)}
              ></i>
            ) : (
              <i
                className='fa-solid fa-eye-slash'
                onClick={() => setPasswordShow((cur) => !cur)}
              ></i>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className='mt-5'>
          <p className='text-red-500'>{error}</p>
        </div>
      )}
      <div className='mt-8'>
        <button
          role='button'
          aria-label='create my account'
          className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600'
          type='submit'
          disabled={loading}
        >
          LOGIN
        </button>
      </div>
    </form>
  );
};

export default LoginComponent;
