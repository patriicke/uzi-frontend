import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../../../api/api";
import { uploadImage } from "../../../../hooks";
import { AdminContext, IAdminContext } from "../../context";
import { IUserType } from "../../pages/UsersPage";

const CreateUserModal: React.FC = () => {
  const { showCreateUser, setShowCreateUser } =
    useContext<IAdminContext>(AdminContext);
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
      const request = await api.post("/admin/create", {
        user: {
          fullname: names,
          email,
          username,
          password,
          profileImage: imageUrl
        } as IUserType
      });
      toast.success("User created successfully");
      setShowCreateUser(false);
      setPassword("");
      setEmail("");
      setUsername("");
      setConfirmPassword("");
      setImageUrl("");
      setNames("");
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.keyCode === 27) {
        setShowCreateUser(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${
        showCreateUser ? "translate-x-0" : "-translate-x-full"
      } duration-200 ease-in-out`}
    >
      <form
        onSubmit={handleSubmit}
        className='bg-white w-[500px] p-12 border shadow-md'
      >
        <p
          tabIndex={0}
          role='heading'
          aria-label='Login to your account'
          className='text-2xl font-extrabold leading-6 text-gray-800 '
        >
          Create Admin account
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
        <div className='mt-5  flex'>
          <div
            className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600 flex items-center justify-center'
            onClick={() => setShowCreateUser(false)}
          >
            CANCEL
          </div>
          <button
            aria-label='create my account'
            className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600'
            type='submit'
            disabled={loading}
          >
            CREATE
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUserModal;
