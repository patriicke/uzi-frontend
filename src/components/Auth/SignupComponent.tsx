import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CommonContext } from "../../context";
import { uploadImage, useSignup } from "../../hooks";

const SignupComponent: React.FC<{
  setLoginPage: any;
  setSignup: any;
}> = ({ setSignup }) => {
  const dispatch = useDispatch();
  const { setLoginPage } = useContext(CommonContext);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [cPasswordShow, setCPasswordShow] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [names, setNames] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const toastId: any = useRef(null);
  const { userData } = useSelector((state: any) => state.user);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (uploadingImage) return;
      if (!email || !confirmPassword || !names || !password)
        return setError("Please complete all fields");
      if (password !== confirmPassword)
        return setError("Passwords don't match!");
      if (image) {
        let url = await uploadImage(image);
        setImageUrl(url);
      }
      useSignup(
        { email, fullname: names, password, profileImage: imageUrl, username },
        setError,
        dispatch,
        setLoginPage,
        setLoading
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageFn = async () => {
    toastId.current = toast.loading("Uploading image...");
    try {
      let url = await uploadImage(image);
      setImageUrl(url);
      toast.update(toastId.current, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        delay: 2000
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId.current, {
        render: "Failed to upload image!",
        type: "error",
        isLoading: false,
        delay: 2000
      });
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    if (image) uploadImageFn();
  }, [image]);
  return (
    <form onSubmit={handleSubmit}>
      <p
        tabIndex={0}
        role='heading'
        aria-label='Login to your account'
        className='text-2xl font-extrabold leading-6 text-gray-800'
      >
        Create account
      </p>
      <p className='text-sm mt-4 font-medium leading-none text-gray-500'>
        Already have account?{" "}
        <span
          tabIndex={0}
          role='link'
          aria-label='Sign up here'
          className='text-sm font-medium leading-none underline text-gray-800 cursor-pointer'
          onClick={() => setSignup("login")}
        >
          {" "}
          Log in here
        </span>
      </p>
      <div className='mt-3'>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Full Name
        </label>
        <input
          aria-label='enter email adress'
          role='input'
          type='text'
          className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNames(e.target.value);
            setError("");
          }}
        />
      </div>
      <div>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Email
        </label>
        <input
          aria-label='enter email adress'
          role='input'
          type='email'
          className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            setError("");
          }}
        />
      </div>
      <div>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Username
        </label>
        <input
          aria-label='enter location'
          role='input'
          type='tel'
          className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
      </div>
      <div>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Profile Image (Optional)
        </label>
        <input
          aria-label='enter location'
          role='input'
          type='file'
          className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setImage(e?.target?.files === null ? null : e.target.files[0]);
            setUploadingImage(true);
            setError("");
          }}
        />
      </div>
      <div className='mt-3  w-full'>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Password
        </label>
        <div className='relative flex items-center justify-center'>
          <input
            aria-label='enter Password'
            role='input'
            type={passwordShow ? "text" : "password"}
            className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
              setError("");
            }}
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
      <div className='mt-3  w-full'>
        <label className='text-sm font-medium leading-none text-gray-800'>
          Confirm Password
        </label>
        <div className='relative flex items-center justify-center'>
          <input
            aria-label='enter Password'
            role='input'
            type={cPasswordShow ? "text" : "password"}
            className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />
          <div className='absolute right-0 mt-2 mr-3 cursor-pointer'>
            {cPasswordShow ? (
              <i
                className='fa-regular fa-eye'
                onClick={() => setCPasswordShow((cur) => !cur)}
              ></i>
            ) : (
              <i
                className='fa-solid fa-eye-slash'
                onClick={() => setCPasswordShow((cur) => !cur)}
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
      <div className='mt-5'>
        <button
          role='button'
          aria-label='create my account'
          className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600'
          type='submit'
          disabled={loading}
        >
          SIGNUP
        </button>
      </div>
    </form>
  );
};

export default SignupComponent;
