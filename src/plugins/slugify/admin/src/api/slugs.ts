import axiosInstance from '../../src/utils/axiosInstance';

const SERVER_HAS_NOT_BEEN_KILLED_MESSAGE = 'did-not-kill-server';
const SERVER_HAS_BEEN_KILLED_MESSAGE = 'server is down';

const slugRequests = {
  getContentTypes: async () => {
    const data = await axiosInstance.get(`/slugify/allContentTypes`);
    return data;
  },

  setSlugs: async (data: any) => {
    const res = await axiosInstance.post('/slugify/setSlugs', data)
    return res
  },

  serverRestartWatcher: async(response: any, didShutDownServer: boolean=false) => {
      return new Promise(resolve => {
        fetch(`${process.env.STRAPI_ADMIN_BACKEND_URL}/_health`, {
          method: 'HEAD',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
            'Keep-Alive': 'false',
          },
        })
          .then(res => {
            if (res.status >= 400) {
              throw new Error(SERVER_HAS_BEEN_KILLED_MESSAGE);
            }
    
            if (!didShutDownServer) {
              throw new Error(SERVER_HAS_NOT_BEEN_KILLED_MESSAGE);
            }
    
            resolve(response);
          })
          .catch(err => {
            setTimeout(() => {
              return slugRequests.serverRestartWatcher(
                response,
                err.message !== SERVER_HAS_NOT_BEEN_KILLED_MESSAGE
              ).then(resolve);
            }, 100);
          });
      });
    }
}

export default slugRequests;