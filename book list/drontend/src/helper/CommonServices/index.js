import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const GlobalLoader = () => {
  return (
    <div className='loader-wrapper'>
      <Spinner animation='grow' />
    </div>
  );
};

export const Toaster = (msg) => {
  const { text, type } = msg;
  if (type === "success") toast.success(text);
  else if (type === "error") toast.error(text);
  else if (type === "info") toast.info(text);
};

export const TextTruncate = ({ str, limit }) => {
  if (str && str.length >= limit) {
    let limitStr = str.substring(0, limit) + '...';
    return limitStr;
  } else {
    return str;
  }
};