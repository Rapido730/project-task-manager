import React from "react";
import { Toast } from "react-bootstrap";

export interface Notification_Props {
  Data: {
    Heading: String;
    Body: String;
  };
  Notification_Toast_Show: boolean;
  Set_Notification_Toast_Show: React.Dispatch<React.SetStateAction<boolean>>;
}

const Notification_Toast = ({
  Data,
  Notification_Toast_Show,
  Set_Notification_Toast_Show,
}: Notification_Props) => {
  return (
    <Toast
      show={Notification_Toast_Show}
      onClose={() => {
        Set_Notification_Toast_Show(false);
      }}
    >
      <Toast.Header>
        <strong className="me-auto">{Data.Heading}</strong>
      </Toast.Header>
      <Toast.Body>{Data.Body}</Toast.Body>
    </Toast>
  );
};

export default Notification_Toast;
