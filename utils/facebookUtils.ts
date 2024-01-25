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

export function loginUserFacebook():Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        resolve(response.authResponse.accessToken);
      } else {
        reject(new Error("Falha na autenticação ou login cancelado pelo usuário."));
      }
    }, {
      config_id: "3773440749555880",
    });
  });
}


export function logoutUserFacebook() {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus(function(response: any) {
      if (response.status === 'connected') {
        window.FB.logout(function(response: any) {
          if (response) {
            resolve(response); 
          } else {
            reject(new Error("Falha ao realizar logout do Facebook"));
          }
        });
      } else {
        reject(new Error("Nenhum usuário está logado no momento."));
      }
    });
  });
}
