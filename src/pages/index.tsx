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
import { Get_User_Document } from "@/Services/User.Services";
import Image from "next/image";
import Task_Image from "../assests/home_page1.jpg";
interface Props {
  User: User_Type | undefined;
}

function Home() {
  const { data } = useSession();
  const Dispatch = useDispatch();

  const { Current_User } = useSelector((State: State_Type) => State.User);
  useEffect(() => {
    if (data) {
      Get_User_Document(data).then((res) => {
        const { Status, Response_Data } = res;
        console.log(Response_Data);
        Dispatch(
          Create_Action(User_Action_Type.Set_Current_User, Response_Data)
        );
        if (Response_Data?.role !== "admin") {
          Dispatch(Create_Action(User_Action_Type.Select_User, Response_Data));
        }
      });
    }
  }, [data, Dispatch]);

  const signinHandler = (event: any) => {
    if (!Current_User) signIn();
    Router.push("/dashboard");
  };

  // useEffect(() => {
  //   Dispatch(Create_Action(User_Action_Type.Set_Current_User, User));
  // }, [data]);

  const Header = dynamic(() => import("../component/header.component"), {
    ssr: false,
  });

  const [ModalFormVisible, setModalFormVisible] = useState(false);

  const changeModalForm = () => {
    setModalFormVisible(true);
  };

  return (
    <div className="tw-h-screen  tw-flex tw-flex-col">
      <div className="tw-flex-none">
        <Header />
      </div>
      <div className="tw-flex-grow tw-mx-4 tw-py-8 tw-flex tw-flex-col lg:tw-flex-row  lg:tw-space-x-64  tw-overflow-auto">
        <div>
          <h1 className="tw-text-7xl tw-w-64 tw-m-4 tw-font-extrabold">
            Makes Project Management Easy
          </h1>

          <div
            className="tw-my-8 clickable border border-dark border-4 tw-w-fit tw-px-2"
            onClick={signinHandler}
          >
            <h1 className=" tw-text-2xl">Get started </h1>
          </div>
        </div>
        <div className="tw-m-4 tw-bg-gray-200 tw-h-fit tw-p-4">
          <Image src={Task_Image} height={400} alt="Tasks"></Image>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Home;

// export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
//   let User = null;
//   try {
//     const data = await getSession(context);
//     console.log(data);
//     const response = await axios.post(
//       "http://localhost:3000/api/database.api/user.api/create_user.api",
//       {
//         email: data?.user?.email,
//         name: data?.user?.name,
//       }
//     );
//     User = response.data.user;
//   } catch {
//     User = null;
//   }

//   console.log({ User });
//   return {
//     props: {
//       User: User,
//     },
//   };
// };
