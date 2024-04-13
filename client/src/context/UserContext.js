import { createContext, useState } from "react";
import Cookies from "js-cookie"


const UserContext = createContext(null);

export const UserProvider = (props) => {
  const cookie = Cookies.get("authenticatedUser");
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null)

    const signIn = async (credentials) => {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
      const fetchOptions = {
          method: "GET",
          headers: {
              Authorization: `Basic ${encodedCredentials}`,
          },
      };
      const response = await fetch("http://localhost:5000/api/users", fetchOptions);
      if (response.status === 200) {
        const user = await response.json();
        user.password = credentials.password;
        setAuthUser(user);
        Cookies.set("authenticatedUser", JSON.stringify(user), { expires: 1 });
        return user;
    } else if (response.status === 401) {
        // (401 = unauthorized)

        return null;
    } else {
        throw new Error();
    }
};

// function for signing out a user
const signOut = () => {
    // reset authUser state
    setAuthUser(null);
    // reset cookies
    Cookies.remove("authenticatedUser");
};

return (
    <UserContext.Provider
        value={{
            authUser,
            actions: {
                signIn, 
                signOut,
            },
        }}
    >
        {props.children}
    </UserContext.Provider>
);
};


export default UserContext;