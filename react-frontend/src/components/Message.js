import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Message() {
  const [result, setResult] = useState(null);

  // useEffect(() => {
  //     axios({
  //         url: "http://127.0.0.1:8000",
  //         method: "get",
  //         responseType: "string",
  //     }).then((res) => {
  //         console.log(res);
  //         setResult(res.data);
  //     }).catch((error) => {
  //         if (error.response) {
  //             console.error(error.response);
  //             console.error(error.response.status);
  //             console.error(error.response.headers);
  //         }
  //     }
  // }, []);
  const message = async () => {
    try {
      let res = await axios.get("http://127.0.0.1:8000");
      let result = res.data;
      setResult(result);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    message();
  }, []);

  return <div>{result}</div>;
}
