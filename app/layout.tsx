import { AuthProvider } from "context/AuthContext"
import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <title>Raise Talk</title>
      </head>
      <body>
        {/* <h2>Add Facebook Login to your webpage</h2>

        <p id="profile"></p>

        <Script id="facebook-sdk">
          {` (function(d, s, id){
                              var js, fjs = d.getElementsByTagName(s)[0];
                              if (d.getElementById(id)) {return;}
                              js = d.createElement(s); js.id = id;
                              js.src = "https://connect.facebook.net/en_US/sdk.js";
                              fjs.parentNode.insertBefore(js, fjs);
                            }(document, 'script', 'facebook-jssdk')
        );`}
        </Script>

        <Script id="facebook-init">
          {`window.fbAsyncInit = function() {
              // Initialize the SDK with your app and the Graph API version for your app
              FB.init({
                appId: '802780334358449',
                xfbml: true,
                version: 'v18.0'
              });

              // If you are logged in, automatically get your name and email address, your public profile information
              FB.login(function(response) {
                if (response.authResponse) {
                  console.log('Welcome! Fetching your information.... ');
                  console.log({response});
                  FB.api('/me/accounts', {fields: 'name, id, access_token'}, function(response) {
                    console.log({response});
                    document.getElementById("profile").innerHTML = 
                      "Good to see you, " + response.name + ". I see your email address is " + response.email;
                  });
                } else { 
                  // If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email
                  console.log('User cancelled login or did not fully authorize.');
                }
              }, {
                config_id: '3773440749555880' // Configuration ID goes here
              });
            };`}
        </Script> */}

        {/* <Script async defer src="https://connect.facebook.net/en_US/sdk.js"></Script> */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
