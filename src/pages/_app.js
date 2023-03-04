import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import cookies from "js-cookie";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (cookies.get("token")) {
      router.push("/");
    } else {
      router.push("/signin");
    }
  }, []);

  return <Component {...pageProps} />;
}
