import { supabase } from "./supabase";

export const getAllCommands = async (sessionCode: string) => {
  supabase.functions
    .invoke("get_all_commands", {
      body: { code: sessionCode, name: "Functions" },
    })
    .then(({ data, error }) => {
      if (error) {
        throw new Error(`Error fetching commands: ${error.message}`);
      }
      return data;
    });
};
