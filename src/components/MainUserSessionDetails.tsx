import React, { useEffect } from "react";
import { getAllItems } from "../utils/getAllItems";
import { useParams } from "react-router-dom";
import { getAllCommands } from "../utils/getAllCommands";

export const MainUserSessionDetails = (userId: any) => {
  const { sessionCode } = useParams();

  useEffect(() => {
    const callGetAllItems = async () => {
      //const data = await getAllCommands(sessionCode as string);
      //console.log(data);
    };

    callGetAllItems();
  }, []);

  return <div>MainUserSessionDetails</div>;
};
