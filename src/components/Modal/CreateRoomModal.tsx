import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { api } from "../../api/api";
import { CommonContext } from "../../context";
import { uploadImage } from "../../hooks";
import { ROOM_VISIBILITY } from "../../lib/romm.access";
import { addRoom } from "../../redux/slices/roomSlice";
import { updateUserRedux } from "../../redux/slices/userSlice";

const CreateRoomModal: React.FC = () => {
  const { createRoomShow, setCreateRoomShow, setRooms } =
    useContext(CommonContext);
  const dispatch = useDispatch();
  document.addEventListener("keydown", (e) => {
    if (e.keyCode == 27) {
      setCreateRoomShow(false);
    }
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [access, setAccess] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const toastId: any = useRef(null);
  const { userData } = useSelector((state: any) => state.user);
  const uploadImageFn = async () => {
    toastId.current = toast.loading("Uploading image...");
    try {
      let url = await uploadImage(image);
      setImageUrl(url);
      toast.update(toastId.current, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.log(error);
      toast.update(toastId.current, {
        render: "Failed to upload image!",
        type: "error",
        isLoading: false,
        autoClose: 2000
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
        setCreateRoomShow(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      if (uploadingImage) {
        return;
      }
      if (!name) {
        setError("Enter room name please!");
        return;
      }
      if (!access) {
        setError("Choose room accessibility");
        return;
      }
      const request = await api.post("/room/create", {
        roomName: name,
        roomImage: imageUrl,
        access
      });
      const response = await request.data;
      dispatch(addRoom(response.room));
      dispatch(
        updateUserRedux({
          ...userData,
          rooms: [...userData.rooms, response.room]
        })
      );
      toast.success("Room created successfully!");
      setCreateRoomShow(false);
    } catch (error) {
      console.log(error);
      toast.error("Unknown error ocurred!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={`h-screen w-screen absolute top-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${
        createRoomShow ? "translate-x-0" : "-translate-x-full"
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
          className='text-2xl font-extrabold leading-6 text-gray-800'
        >
          Create your room
        </p>
        <div>
          <label className='text-sm font-medium leading-none text-gray-800'>
            Room Name
          </label>
          <input
            role='input'
            type='text'
            className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
            placeholder='Room Name'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setName(e.target.value);
              setError("");
            }}
            value={name}
          />
        </div>
        <div className='pt-2'>
          <label className='text-sm font-medium leading-none text-gray-800'>
            Accessibility
          </label>
          <div className='flex gap-2 pt-1'>
            <input
              type='radio'
              name='access'
              id='b'
              onChange={(e) => setAccess(ROOM_VISIBILITY.PUBLIC)}
            />
            <label htmlFor='b' className='text-sm'>
              Anyone with a link can join conversation
            </label>
          </div>
          <div className='flex gap-2 pt-1'>
            <input
              type='radio'
              name='access'
              id='a'
              onChange={(e) => setAccess(ROOM_VISIBILITY.PRIVATE)}
            />
            <label htmlFor='a' className='text-sm'>
              Only allowed members can join conversation
            </label>
          </div>
        </div>
        <div className='mt-2  w-full'>
          <label className='text-sm font-medium leading-none text-gray-800'>
            Image (Optional)
          </label>
          <div className='relative flex items-center justify-center'>
            <input
              role='input'
              type={"file"}
              className='bg-gray-200 border rounded focus:outline-none text-sm font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2'
              placeholder='Image file'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setImage(e?.target?.files === null ? null : e.target.files[0]);
              }}
            />
          </div>
        </div>
        {error && (
          <div className='mt-5'>
            <p className='text-red-500'>{error}</p>
          </div>
        )}
        <div className='mt-8 flex'>
          <div
            className='focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-sm font-semibold leading-none text-white focus:outline-none bg-primary-500 border rounded hover:bg-primary-500 py-4 w-full disabled:bg-slate-600 flex items-center justify-center cursor-pointer'
            onClick={() => setCreateRoomShow(false)}
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

export default CreateRoomModal;
