import { createContext,useState,useEffect } from "react";

export const Templateurl=createContext();
export const TemplateurlProvider=({children})=>{
     const [templateurl, setTemplateurl] = useState(() => {
    const saved = localStorage.getItem("templateurl");
    try {
      return saved ? JSON.parse(saved) : { start: "", end: "" };
    } catch {
      return { start: "", end: "" };
    }
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("templateurl", JSON.stringify(templateurl));
  }, [templateurl]);
    return(
        <Templateurl.Provider value={{templateurl,setTemplateurl}}> 
            {children}
        </Templateurl.Provider>
    )
}   