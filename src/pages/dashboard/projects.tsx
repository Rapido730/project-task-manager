import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { User_Type } from "@/DB/models/User.Model";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useSession, getSession } from "next-auth/react";
import { State_Type } from "@/Store/Root_Reducer";
import { signIn } from "next-auth/react";
import Router from "next/router";
import Create_Action from "@/Store/Action_Creator";
import { User_Action_Type } from "@/Store/User/User.Types";
import { GetServerSideProps } from "next";
import axios from "axios";
import Manager_Body from "@/component/manager_body.component";
import Developer_Body from "@/component/developer_body.component";
interface Props {
  User: User_Type | undefined;
}

function Home() {
  const { data } = useSession();
  const Dispatch = useDispatch();

  const { Current_User } = useSelector((State: State_Type) => State.User);


  const Header = dynamic(() => import("../../component/header.component"), {
    ssr: false,
  });

  const [ModalFormVisible, setModalFormVisible] = useState(false);

  const changeModalForm = () => {
    setModalFormVisible(true);
  };

  return (
    <div className="tw-h-screen tw-flex tw-flex-col">
      <div className="tw-flex-none">
        <Header />
      </div>
      <div className="tw-flex-grow tw-overflow-auto">
        <Developer_Body />
      </div>
      <div></div>
    </div>
  );
}

export default Home;

