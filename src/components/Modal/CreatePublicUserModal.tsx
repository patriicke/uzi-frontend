import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { api } from "../../api/api";
import { CommonContext } from "../../context";
import { login } from "../../redux/slices/userSlice";
import { ICommonContext } from "../../types/common.context";

const CreatePublicUserModal: React.FC = () => {
  const { createPublicUserShow, setCreatePublicUserShow } =
    useContext<ICommonContext>(CommonContext);
  const dispatch = useDispatch();
  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 27) {
      setCreatePublicUserShow(false);
    }
  });
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.keyCode === 27) {
        setCreatePublicUserShow(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!username) {
        setError("Enter your username please!");
        return;
      }
      const response = await api.post("/user/public/create", {
        username
      });
      const data = response.data;
      dispatch(login({ ...data.user, token: data.token }));
      localStorage.setItem("token", data.token);
      console.log(data.token);
      toast.success("You can now join different rooms!");
      setCreatePublicUserShow(false);
    } catch (error: any) {
      setError(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${
        createPublicUserShow ? "translate-x-0" : "-translate-x-full"
      } duration-200 ease-in-out`}
    >
      <form
        onSubmit={handleSubmit}
        className={"p-8 border shadow-lg bg-white rounded-md"}
      >
        <p
          tabIndex={0}
          role='heading'
          aria-label='Create room'
          className='text-xl font-semibold leading-6 text-gray-800'
        >
          Provide a username to use!
        </p>
        <div className='pt-2'>
          <label className='text-sm font-medium leading-none text-gray-800'>
            Username
          </label>
          <input
            role='input'
            type='text'
            className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
            placeholder='Username'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUsername(e.target.value);
              setError("");
            }}
            value={username}
          />
        </div>
        {error && <div className='pt-2 text-red-500'>{error}</div>}
        <div className='mt-8 flex gap-2'>
          <div
            className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600 flex items-center justify-center cursor-pointer'
            onClick={() => setCreatePublicUserShow(false)}
          >
            CANCEL
          </div>
          <button
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

export default CreatePublicUserModal;
