import { toast } from 'react-toastify';
import { CheckCircleSolid, ExclamationCircleSolid, InformationCircleSolid } from '../components/icons';

const CheckCircleStyled = () => {
  return <CheckCircleSolid style={{ color: '#CCA483' }} />;
};

const ExclamationCircleStyled = () => {
  return <ExclamationCircleSolid style={{ color: '#C0392B' }} />;
};

const InformationCircleStyled = () => {
  return <InformationCircleSolid style={{ color: '#CCA483' }} />;
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: ExclamationCircleStyled,
  });
  return;
};

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 1200,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: CheckCircleStyled,
  });
  return;
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    position: 'top-center',
    autoClose: 800,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    icon: InformationCircleStyled,
  });
  return;
};