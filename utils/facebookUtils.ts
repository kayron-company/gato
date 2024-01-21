declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

export async function initializeFacebook() {
  const script = document.createElement("script");
  script.src = "https://connect.facebook.net/en_US/sdk.js";
  script.async = true;
  script.defer = true;
  script.id = "facebook-jssdk";
  document.body.appendChild(script);

  window.fbAsyncInit = function() {
    window.FB.init({
      appId: "802780334358449", // Use your own appId
      cookie: true, // Enable cookies to allow the server to access the session
      xfbml: true,
      version: "v18.0",
    });
  };
}

export function loginUserFacebook(handleResponse: (response: any) => void) {
  window.FB.login(
    function (response: any) {
      if (response.authResponse) {
        console.log("Welcome! Fetching your information.... ");
        handleResponse(response.authResponse.accessToken);
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    },
    {
      config_id: "3773440749555880", 
    }
  ); 
}

export function logoutUserFacebook() {
  window.FB.getLoginStatus(function(response: any) {
    if (response.status === 'connected') {
      window.FB.logout(function() {        
        window.location.href = "/login";
      });
    } else {
      console.log("No user is currently logged in.");
    }
  });
}