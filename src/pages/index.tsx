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
interface Props {
  User: User_Type | undefined;
}

function Home({ User }: Props) {
  const { data } = useSession();
  const Dispatch = useDispatch();

  const { Current_User } = useSelector((State: State_Type) => State.User);

  const signinHandler = (event: any) => {
    signIn();
    Router.push("/dashboard");
  };

  useEffect(() => {
    Dispatch(Create_Action(User_Action_Type.Set_Current_User, User));
  }, [data]);

  const Header = dynamic(() => import("../component/header.component"), {
    ssr: false,
  });

  const [ModalFormVisible, setModalFormVisible] = useState(false);

  const changeModalForm = () => {
    setModalFormVisible(true);
  };

  return (
    <div className="">
      <div>
        <Header />
      </div>
      <div>
        <Manager_Body />
      </div>
      <div></div>
    </div>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  let User = null;
  try {
    const data = await getSession(context);
    console.log(data);
    const response = await axios.post(
      "http://localhost:3000/api/database.api/user.api/create_user.api",
      {
        email: data?.user?.email,
        name: data?.user?.name,
      }
    );
    User = response.data.user;
  } catch {
    User = null;
  }

  console.log({ User });
  return {
    props: {
      User: User,
    },
  };
};
