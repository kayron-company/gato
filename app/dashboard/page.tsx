"use client"

import axios from "axios"
import Cookies from "js-cookie"
import { useEffect } from "react"
import { initializeFacebook, logoutUserFacebook } from "utils/facebookUtils"

export default function Dashboard() {
  // Load the SDK script asynchronously
  useEffect(() => {
    initializeFacebook()
  }, [])

  const logoutUser = async () => {
    // Logout from Facebook

    // Get session token from cookie
    const sessionToken = Cookies.get("RT_sessionToken")
    console.log({ sessionToken })
    // Logout from your app
    try {
      const response = await axios.post(
        "http:localhost:5000/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      )
      console.log(response.data)

      // Remove session token from cookie
      Cookies.remove("RT_sessionToken")
      logoutUserFacebook()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <h1>Dashboard</h1>
      <button onClick={logoutUser}>Logout</button>
    </>
  )
}
