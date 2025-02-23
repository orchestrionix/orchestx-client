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

export const DEFAULT_TOAST_DURATION = 800;
export const DEFAULT_TOAST_POSITION = 'top-left';
export const DEFAULT_TOAST_UPDATE = 'Succesvol aangepast.';
export const DEFAULT_TOAST_DELETE = 'Succesvol verwijderd.';
export const DEFAULT_TOAST_CREATE = 'Succesvol aangemaakt.';

export const DEFAULT_LOADING_MESSAGE = 'laden...';
export const DEFAULT_ERROR_MESSAGE = 'Er is iets misgelopen.';

export const DEFAULT_TOAST_CONFIG: any = {
  pending: {
    position: DEFAULT_TOAST_POSITION,
    render() {
      return DEFAULT_LOADING_MESSAGE;
    },
  },
  autoClose: DEFAULT_TOAST_DURATION,
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