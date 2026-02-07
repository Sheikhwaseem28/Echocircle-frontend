import { API_URL } from "../api";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <div
      className="flex h-[60px] w-[60px] overflow-hidden rounded-full"
      style={{ width: size, height: size }}
    >
      <img
        src={`${API_URL}/assets/${image}`}
        alt="user"
        className="h-full w-full object-cover"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default UserImage;