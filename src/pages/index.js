import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import jwt from "jsonwebtoken";
import cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Modal from "@/components/modal";
import { useRouter } from "next/router";
import UpdateModal from "@/components/updateModal";
import DeleteModal from "@/components/deleteModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  const [newCon, setNewCon] = useState(false);
  const [upCon, setUpCon] = useState(false);
  const [delCon, setDelCon] = useState(false);
  const router = useRouter();
  const token = cookies.get("token");

  const getContacts = async (event) => {
    const decoded = await jwt_decode(token);
    const uid = decoded.payload;
    console.log("---------------", uid);
    const response = await fetch(
      "https://modern-newt-blazer.cyclic.app/contact/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: uid }),
      }
    );
    const data = await response.json();
    console.log(data.data);
    setData(data.data);
  };

  const handleDelete = async (contact) => {
    const decoded = await jwt_decode(token);
    const uid = decoded.payload;
    console.log("---------------", uid);

    const response = await fetch(
      "https://modern-newt-blazer.cyclic.app/contact/delete",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactId: contact._id, userId: uid }),
      }
    );
    const data = await response.json();
    setNewCon(false);
    console.log(data);
  };

  useEffect(() => {
    if (token) {
      getContacts();
    } else {
      router.push("/signin");
    }
  }, [newCon, upCon, delCon]);

  return (
    <>
      {newCon ? <Modal setNewCon={setNewCon} /> : null}
      <section class="bg-gray-50 dark:bg-gray-900 min-h-screen h-fit">
        <div className="flex justify-center">
          <a
            href="#"
            class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <span className="text-yellow-500">Yellow</span>Contact
          </a>
        </div>
        <div class="px-4 pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-16">
          {data.map((contact) => (
            <div className="bg-white h-24 w-full rounded-xl flex justify-between">
              <div className="flex flex-col justify-center items-start h-full pl-4">
                <h1 className="font-bold">{contact.name}</h1>
                <h1>{contact.number}</h1>
              </div>
              <div className="flex justify-center items-center h-full pl-4 gap-4 pr-4">
                {upCon ? (
                  <UpdateModal setUpCon={setUpCon} contact={contact} />
                ) : null}
                {delCon ? (
                  <DeleteModal setDelCon={setDelCon} contact={contact} />
                ) : null}
                <button
                  class="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={() => setDelCon(true)}
                >
                  Delete
                </button>
                <button
                  class="w-full text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"
                  onClick={() => setUpCon(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setNewCon(true)}
          title="Add Contact"
          class="fixed z-90 bottom-10 right-8 bg-yellow-500 w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl "
        >
          +
        </button>
      </section>
    </>
  );
}
