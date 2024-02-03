import Cookies from "js-cookie";

declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}

export function initializeFacebook(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("facebook-jssdk")) {
      resolve();
      return;
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "802780334358449",
        cookie: true,
        xfbml: true,
        version: "v18.0",
      });
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.id = "facebook-jssdk";
    document.body.appendChild(script);
  });
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


export async function logoutUserFacebook() {
  try {
    const response = await new Promise((resolve, reject) => {
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
    
    localStorage.clear(); 
    localStorage.removeItem("sessionToken")
    
    Cookies.remove("RT_accessToken")
    Cookies.remove("RT_refreshToken")
    Cookies.remove("RT_refreshTokenJti")
    Cookies.remove("RT_user")
    
    window.location.href = "/login";
    
    return response;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}

export function getLeadDetails(leadId: string, pageAccessToken: string): Promise<any> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      `/${leadId}`,
      'GET',
      { access_token: pageAccessToken }, // Usando o token de acesso da página
      function(response: any) {
        if (response && !response.error) {
          resolve(response);
        } else {
          reject(response.error);
        }
      }
    );
  });
}

export function getLeadDetailsMock(created_time: string, leadId: string, pageAccessToken: string): Promise<FacebookLeadData> {
  // Aqui você pode simular uma chamada de API ou retornar dados estáticos
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        created_time,
        id: leadId,
        field_data: [
          {
            name: 'full_name',
            values: ['Mateus Oliveira']
          },
          {
            name: 'email',
            values: ['mateus.oliveira.developer@gmail.com']
          },
          {
            name: 'phone_number',
            values: ['+5585997375248']
          }
          // Adicione mais campos conforme necessário
        ]
      });
    }); // Simula um atraso de rede
  });
}
interface FacebookPageData {
  id: string;
  access_token: string;
  // Outros campos da resposta da Graph API que você pode precisar
}

export function getPageAccessToken(userAccessToken: string, pageId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    window.FB.api(
      '/me/accounts', // Endpoint para buscar as páginas que o usuário gerencia
      'GET',
      { access_token: userAccessToken }, // Usando o token de acesso do usuário
      function(response: any) {
        if (response && !response.error) {
          const pages: FacebookPageData[] = response.data;
          const pageData = pages.find(page => page.id === pageId);
          if (pageData) {
            resolve(pageData.access_token); // Retorna o token de acesso da página específica
          } else {
            reject(new Error("Página específica não encontrada"));
          }
        } else {
          reject(response.error);
        }
      }
    );
  });
}

interface FacebookLeadData {
  created_time: string;
  id: string;
  field_data: Array<{
    name: string;
    values: string[];
  }>;
}

export interface FormattedLeadData {
  created_time: string;
  id: string;
  full_name?: string;
  email?: string;
  phone_number?: string;
  facebook_page_name?: string;
  facebook_page_id?: string;
  status?: string;
}

export function formatLeadData(leadData: FacebookLeadData, facebookPageName: string, status: string, facebookPageId: string): FormattedLeadData {
  const formattedData: FormattedLeadData = {
    created_time: leadData.created_time,
    id: leadData.id,
    facebook_page_name: facebookPageName,
    facebook_page_id: facebookPageId,
    status: status
  };

  leadData.field_data.forEach(field => {
    if (field.values.length > 0 && field.values[0] !== undefined) {
      formattedData[field.name as keyof FormattedLeadData] = field.values[0];
    }
  });

  return formattedData;
}

